from api.models import Heat
from rest_framework import serializers
from api.CustomField import HeatDurationField


class EventResultSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.ReadOnlyField(source="athlete.full_name")
    heat_time = HeatDurationField()

    class Meta:
        model = Heat
        fields = ('id', 'athlete', 'athlete_full_name', 'heat_time')