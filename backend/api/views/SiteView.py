from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from api.models import Site
from api.serializers.SiteSerializer import SiteSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.pagination import LimitOffsetPagination
from django.db.models.functions import Collate
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Site'])
class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['name']
    ordering = ['name']
    search_fields = ['^name_search']
    http_method_names = ['get', 'post', 'delete', 'patch']

    def list(self, request):
        queryset = self.get_queryset()
        # Create an deterministic field for search
        queryset = queryset.annotate(name_search=Collate("name", "und-x-icu"))
        # Eliminate duplicate rows
        queryset = queryset.distinct()
        filter_query_set = self.filter_queryset(queryset)
        # Paginate the filtered queryset
        paginator = LimitOffsetPagination()
        paginated_query_set = paginator.paginate_queryset(filter_query_set, request)
        # Serialize the paginated queryset
        serializer = self.get_serializer_class()(paginated_query_set, many=True)
        # Return paginated response
        return paginator.get_paginated_response(serializer.data)
