from api.models import Heat
from rest_framework import serializers
from api.CustomField import HeatDurationField


class CompleteHeatSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.SerializerMethodField()
    seed_time = HeatDurationField()

    class Meta:
        model = Heat
        fields = ('id', 'lane_num', 'athlete', 'athlete_full_name', 'seed_time')

    def get_athlete_full_name(self, instance):
        if isinstance(instance, Heat):
            athlete = instance.athlete
            if athlete:
                return athlete.full_name
        return None

class ResumeHeatSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.SerializerMethodField()
    heat_time = HeatDurationField(write_only=True)

    class Meta:
        model = Heat
        fields = ('id', 'num_heat', 'athlete', 'athlete_full_name', 'heat_time')



    def get_athlete_full_name(self, instance):
        if isinstance(instance, Heat):
            athlete = instance.athlete
            if athlete:
                return athlete.full_name
        return None
