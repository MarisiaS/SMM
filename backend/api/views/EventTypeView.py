from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import EventType
from api.serializers.EventTypeSerializer import EventTypeSerializer
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Event Type'])
class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']
