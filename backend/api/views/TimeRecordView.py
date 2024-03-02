from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import TimeRecord, EventType
from api.serializers.TimeRecordSerializer import TimeRecordSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Q
from django.db.models.functions import Cast
from django.db.models.functions import Collate
from rest_framework.exceptions import ValidationError
from rest_framework import status

import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Time Record'], request=TimeRecordSerializer)
class TimeRecordViewSet(viewsets.ModelViewSet):
    queryset = TimeRecord.objects.all()
    serializer_class = TimeRecordSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'patch']

    def get_queryset(self):
        queryset = super().get_queryset()

        athlete_name = self.request.query_params.get('athlete_name', None)
        event_type_id = self.request.query_params.get('event_type_id', None)

        if athlete_name:
             # Add deterministic collation to first_name and last_name
            queryset = queryset.annotate(first_name_deterministic=Collate("athlete__first_name", "und-x-icu"), last_name_deterministic=Collate("athlete__last_name", "und-x-icu"))
            queryset = queryset.filter(
                Q(first_name_deterministic__startswith=athlete_name)|
                Q(last_name_deterministic__startswith=athlete_name)
            )
        if event_type_id and EventType.objects.filter(pk=event_type_id).exists():
            queryset = queryset.filter(event_type = event_type_id)
        else:
            raise ValidationError({'error':"Event type with this ID does not exist."}, code=status.HTTP_400_BAD_REQUEST)
        return queryset
    
    @extend_schema(parameters =[OpenApiParameter(name="athlete_name", type=str),
                                OpenApiParameter(name="event_type_id", type=str),])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)