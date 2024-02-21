from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from api.models import SwimMeet
from api.serializers.SwimMeetSerializer import SwimMeetSerializer
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['SwimMeet'])
class SwimMeetViewSet(viewsets.ModelViewSet):
    queryset = SwimMeet.objects.all()
    serializer_class = SwimMeetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['date']
    ordering = ['date']
    http_method_names = ['get', 'post', 'delete', 'patch']
