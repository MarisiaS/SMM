from api.models import Session
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            name='respose',
            value={
                "id": 2,
                "name": "MON-WED-FRI-19",
                "days_of_week": [
                    1,
                    0,
                    1,
                    0,
                    1,
                    0,
                    0
                ],
                "time": "19:00:00",
                "coach": 1,
                "school": 1
            },
            response_only=True,  # signal that example only applies to responses
            ),
        OpenApiExample(
            name='request',
            value={
                "name": "MON-WED-FRI-19",
                "days_of_week": [
                    1,
                    0,
                    1,
                    0,
                    1,
                    0,
                    0
                ],
                "time": "19:00:00",
                "coach": 1,
                "school": 1
            },
            request_only=True,
            ),
    ]
)
class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Session
        fields = ('id', 'name', 'days_of_week', 'time', 'coach', 'school')

    def validate_days_of_week(self, value):
        if len(value) != 7:
            raise serializers.ValidationError("Days of the week has to have a lenght of 7")
        if not any(value):
            raise serializers.ValidationError("At least a day of the week has to be chosen.")
        return value
