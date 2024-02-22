from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import Athlete
from api.serializers.AthleteSerializer import AthleteSerializer
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Athlete'])
class AthleteViewSet(viewsets.ModelViewSet):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'patch']
