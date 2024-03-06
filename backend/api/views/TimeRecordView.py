from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import TimeRecord, EventType, Group
from api.serializers.TimeRecordSerializer import TimeRecordSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db.models import Q, F, Value, Func, IntegerField
from django.db.models.functions import Collate, Concat
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.utils import timezone

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
        group_id = self.request.query_params.get('group_id', None)

        if athlete_name:
            # Add deterministic collation to full name (concatenation of first_name and last_name)
            
            queryset = queryset.annotate(full_name_deterministic=Collate(
                Concat(F('athlete__first_name'), Value(' '), F('athlete__last_name')),
                'und-x-icu'
            ))
            # Add deterministic collation to first_name and last_name
            queryset = queryset.annotate(first_name_deterministic=Collate("athlete__first_name", "und-x-icu"), last_name_deterministic=Collate("athlete__last_name", "und-x-icu"))
            queryset = queryset.filter(
                Q(full_name_deterministic__istartswith=athlete_name)|
                 Q(first_name_deterministic__istartswith=athlete_name)|
                Q(last_name_deterministic__istartswith=athlete_name)
            )

        if event_type_id:
            if EventType.objects.filter(pk=event_type_id).exists():
                queryset = queryset.filter(event_type=event_type_id)
            else:
                raise ValidationError(
                    {'error': "Event type with this ID does not exist."}, code=status.HTTP_400_BAD_REQUEST)

        if group_id is not None:
            queryset = queryset.annotate(
                age=Func(
                    Value("year"),
                    Func(Value(timezone.now().date()), F(
                        "athlete__date_of_birth"), function="age"),
                    function="date_part",
                    output_field=IntegerField()))
            try:
                group_instance = Group.objects.get(id=group_id)
            except Group.DoesNotExist:
                raise ValidationError(
                    {'error': "Group does not exist"}, code=status.HTTP_400_BAD_REQUEST)
            gender = group_instance.gender
            if gender != 'MX':
                queryset = queryset.filter(athlete__gender=gender)
            min_age = group_instance.min_age
            max_age = group_instance.max_age
            if max_age is not None:
                queryset = queryset.filter(age__lte=max_age)
            if min_age is not None:
                queryset = queryset.filter(age__gte=min_age)
        return queryset

    @extend_schema(parameters=[OpenApiParameter(name="athlete_name", type=str),
                               OpenApiParameter(
                                   name="event_type_id", type=int),
                               OpenApiParameter(name="group_id", type=int),
                               ])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
