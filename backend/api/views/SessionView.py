from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import Session
from api.serializers.SessionSerializer import SessionSerializer
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Session'])
class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'patch']
