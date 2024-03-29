from api.models import TimeRecord
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from datetime import timedelta


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            name='respose',
            value= {
                "id": 1,
                "athlete": 2,
                "athlete_full_name": "Ana Gomez",
                "event_type": 2,
                "event_type_name": "4x50 M Relay",
                "swim_meet": 1,
                "time": "48.35",
                "date": "2024-03-01"
                },
            response_only=True,  # signal that example only applies to responses
            ),
        OpenApiExample(
            name='request',
            value={
                "athlete": 4,
                "event_type": 1,
                "swim_meet": 1,
                "time": "48.35",
                "date": "2024-03-01"
                },
            request_only=True,
            ),
    ]
)

class TimeRecordSerializer(serializers.ModelSerializer):
    event_type_name = serializers.ReadOnlyField(source="event_type.name")
    athlete_full_name = serializers.ReadOnlyField(source="athlete.full_name")

    class Meta:
        model = TimeRecord
        fields = ('id', 'athlete', 'athlete_full_name','event_type', 'event_type_name', 'swim_meet', 'time', 'date')

    
    def validate_time(self, value):
        # timedelta object with zero duration for comparasion purposes
        zero_duration = timedelta()
        if value <= zero_duration:
            raise serializers.ValidationError("Time cannot be zero or negative.")
        return value
