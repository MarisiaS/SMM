from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from api.models import Group
from api.serializers.GroupSerializer import GroupSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db.models import Q
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
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        queryset = super().get_queryset()

        filtering_group_id = self.request.query_params.get('filtering_group_id', None)
        print(filtering_group_id)
        if not filtering_group_id:
            return queryset

        try:
            filtering_group = Group.objects.get(id=filtering_group_id)
        except Group.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        filter_gender = filtering_group.gender
        filter_min_age = filtering_group.min_age
        filter_max_age = filtering_group.max_age
        if filter_gender != "MX":
            queryset = queryset.filter(gender = filter_gender)
        if filter_max_age and filter_min_age:
            queryset = queryset.filter(Q(min_age__lte=filter_max_age) | Q(max_age__gte=filter_min_age) )
        elif filter_min_age and filter_max_age is None:
            queryset = queryset.filter(min_age__gte = filter_min_age)
        elif filter_max_age and filter_min_age is None:
            queryset = queryset.filter(max_age__lte = filter_max_age)
        return queryset.exclude(id=filtering_group.id)