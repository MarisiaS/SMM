from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import TimeRecord
from api.serializers.TimeRecordSerializer import TimeRecordSerializer
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Time Record'], request=TimeRecordSerializer)
class TimeRecordViewSet(viewsets.ModelViewSet):
    queryset = TimeRecord.objects.all()
    serializer_class = TimeRecordSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'patch']
