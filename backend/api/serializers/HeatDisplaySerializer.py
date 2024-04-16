from api.models import Heat, TimeRecord
from rest_framework import serializers
from api.CustomField import HeatDurationField
from django.db import transaction


class HeatSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.SerializerMethodField()
    seed_time = HeatDurationField()
    heat_time = HeatDurationField()


    class Meta:
        model = Heat
        fields = ('id', 'lane_num', 'athlete', 'athlete_full_name', 'seed_time', 'heat_time')

    def get_athlete_full_name(self, instance):
        if isinstance(instance, Heat):
            athlete = instance.athlete
            if athlete:
                return athlete.full_name
        return None

class LaneSerializer(serializers.ModelSerializer):
    athlete_full_name = serializers.SerializerMethodField()
    # Setting write_only directly on the field as HeatDurationField is not a model field
    heat_time = HeatDurationField(write_only=True)

    class Meta:
        model = Heat
        fields = ('id', 'num_heat', 'athlete', 'athlete_full_name', 'heat_time')

        extra_kwargs = {
            'athlete': {'read_only': True},
            'athlete_full_name': {'read_only': True},
        }



    def get_athlete_full_name(self, instance):
        if isinstance(instance, Heat):
            athlete = instance.athlete
            if athlete:
                return athlete.full_name
        return None
    
    @transaction.atomic
    def update(self, instance, validated_data):
        #Updates heat_time
        instance.heat_time = validated_data.get('heat_time')
        instance.save()

    
        #Register the time on TimeRecord
        athlete = validated_data.get('athlete', instance.athlete)
        event_instance = self.context['event']
        event_type = event_instance.event_type
        swim_meet = event_instance.swim_meet
        TimeRecord.objects.create(
            athlete = athlete,
            event_type = event_type,
            swim_meet = swim_meet,
            date = swim_meet.date,
            time = instance.heat_time
        )
        return instance



