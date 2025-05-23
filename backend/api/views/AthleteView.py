from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Collate
from api.models import Athlete
from api.serializers.AthleteSerializer import AthleteSerializer
from api.CustomFilter import filter_by_group
from drf_spectacular.utils import extend_schema, OpenApiParameter
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Athlete'])
class AthleteViewSet(viewsets.ModelViewSet):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter, SearchFilter]
    http_method_names = ['get', 'post', 'delete', 'patch']
    search_fields = ['^first_name_search', '^last_name_search']
    ordering = ['first_name']

    def get_queryset(self):
        queryset = Athlete.objects.annotate(
            first_name_search=Collate("first_name", "und-x-icu"),
            last_name_search=Collate("last_name", "und-x-icu"),
        )
        group_id = self.request.query_params.get('group_id')
        if group_id is not None:
            queryset = filter_by_group(group_id=group_id, queryset=queryset)
        return queryset

    @extend_schema(parameters=[OpenApiParameter(name="group_id", type=int),])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
