from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import Group
from api.serializers.GroupSerializer import GroupSerializer
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Group'])
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']
