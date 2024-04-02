from api.models import Heat
from rest_framework import serializers
from api.CustomField import HeatDurationField


class CompleteHeatSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.ReadOnlyField(source="athlete.full_name")
    seed_time = HeatDurationField()

    class Meta:
        model = Heat
        fields = ('id', 'lane_num', 'athlete', 'athlete_full_name', 'seed_time')

class ResumeHeatSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.ReadOnlyField(source="athlete.full_name")

    class Meta:
        model = Heat
        fields = ('id', 'num_heat', 'athlete_full_name')

