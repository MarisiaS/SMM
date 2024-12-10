from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from api.models import Group
from api.serializers.GroupSerializer import GroupSerializer
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db.models import Q, Case, When, Value, F, CharField, IntegerField
from django.db.models.functions import Concat
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Group'])
@extend_schema(methods=['GET'],
               parameters=[
                OpenApiParameter(
                    name='filtering_group_id',
                    description='ID of the filtering group to apply custom filtering logic.',
                    required=False,
                    type=OpenApiTypes.INT,
                    location=OpenApiParameter.QUERY,
                )
               ],
)
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.annotate(
            gender_display=Case(
                When(gender="F", then=Value("Girls")),
                When(gender="M", then=Value("Boys")),
                When(gender="MX", then=Value("Mixed")),
                output_field=CharField(),
            ),
            age_range=Case(
                When(min_age__isnull=False, max_age__isnull=False, min_age=F('max_age'), then=Concat(F('min_age'), Value(""))),
                When(min_age__isnull=False, max_age__isnull=False, then=Concat(F('min_age'), Value("to"), F('max_age'))),
                When(min_age__isnull=False, max_age__isnull=True, then=Concat(F('min_age'), Value("&Above"))),
                When(min_age__isnull=True, max_age__isnull=False, then=Concat(F('max_age'), Value("&Under"))),
                default=Value(""),
                output_field=CharField(),
            ),
            generated_name=Concat(
                F('gender_display'),
                F('age_range'),
                output_field=CharField(),
            ),
            gender_priority=Case(
                When(gender="MX", then=Value(0)), 
                When(gender="F", then=Value(1)),
                When(gender="M", then=Value(2)),  
                output_field=IntegerField(),
            )
        )

        filtering_group_id = self.request.query_params.get('filtering_group_id', None)
        if not filtering_group_id:
            return queryset.order_by('gender_priority','generated_name')

        try:
            filtering_group = Group.objects.get(id=filtering_group_id)
        except Group.DoesNotExist:
            raise NotFound(detail="Filtering group not found")

        filter_gender = filtering_group.gender
        filter_min_age = filtering_group.min_age
        filter_max_age = filtering_group.max_age
        if filter_gender != "MX":
            queryset = queryset.filter(gender = filter_gender)
        if filter_max_age and filter_min_age:
            queryset = queryset.filter(Q(min_age__lte=filter_max_age) | Q(max_age__gte=filter_min_age) )
        elif filter_min_age and filter_max_age is None:
            queryset = queryset.filter(Q(min_age__gte=filter_min_age) | Q(max_age__gte=filter_min_age))
        elif filter_max_age and filter_min_age is None:
            queryset = queryset.filter(Q(max_age__lte=filter_max_age) | Q(min_age__lte=filter_max_age))
        return queryset.exclude(id=filtering_group.id).order_by('gender_priority','generated_name')