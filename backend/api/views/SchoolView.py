from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from api.models import School
from api.serializers.SchoolSerializer import SchoolSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from django.db.models.functions import Collate
from rest_framework.pagination import LimitOffsetPagination
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['School'])
class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['name']
    ordering = ['name']
    search_fields = ['^name_search']
    http_method_names = ['get', 'post', 'delete']


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


