from api.models import Athlete, Heat
from rest_framework import serializers
from django.db import transaction
from api.CustomField import HeatDurationField
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
import math


class AthleteSeedSerializer(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Athlete.objects.all())
    seed_time = HeatDurationField()

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            name='Generate heat request body',
            value={
                "athletes": [
                    {
                        "id": 1,
                        "seed_time": "45.00"
                    },
                    {
                        "id": 2,
                        "seed_time": "26.09"
                    },
                    {
                        "id": 3,
                        "seed_time": "NT"
                    }
                ]
            },
            request_only=True, 
            )
    ]
)
class GenerateHeatSerializer(serializers.Serializer):
    athletes = AthleteSeedSerializer(many=True)

    def validate_athletes(self, value):
        athlete_ids = [athlete['id'].id for athlete in value]
        if len(athlete_ids) != len(set(athlete_ids)):
            raise serializers.ValidationError("Athletes must not be repeated.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        num_lanes = self.context['num_lanes']
        event_instance = self.context['event']
        athletes = validated_data.pop('athletes', [])
        athletes_sorted = sorted(athletes, key=lambda x: -x['seed_time'])
        num_athletes = len(athletes_sorted)
        current_num_heat = 0
        num_empty_athletes = (num_lanes - num_athletes%num_lanes) % num_lanes
        num_empty_athletes_current_heat = math.ceil(num_empty_athletes / 2) if num_athletes > num_lanes else num_empty_athletes
        while(athletes_sorted):
            current_num_heat += 1
            current_heat_athletes = athletes_sorted[:num_lanes - num_empty_athletes_current_heat]
            athletes_sorted = athletes_sorted[num_lanes - num_empty_athletes_current_heat:]
            for i in range(num_empty_athletes_current_heat, num_lanes):
                num_lane = self.calculate_lane_num(i,num_lanes)
                Heat.objects.create(
                    event = event_instance,
                    athlete = current_heat_athletes[i - num_empty_athletes_current_heat]["id"],
                    lane_num = num_lane,
                    seed_time = current_heat_athletes[i - num_empty_athletes_current_heat]["seed_time"],

                    heat_time=None,
                    num_heat=current_num_heat
                )
            num_empty_athletes -= num_empty_athletes_current_heat
            num_empty_athletes_current_heat = num_empty_athletes
        
        event_instance.total_num_heats = current_num_heat    
        event_instance.save()
        return event_instance
   
    def calculate_lane_num(self, index, num_lanes):
        #Calculates the corresponding lane number for an athlete at a given index on the list of athletes.
        remainder = index % num_lanes
        half_lane = math.ceil(num_lanes / 2)
        side = math.pow(-1,remainder)
        distance_to_half = (num_lanes - remainder) // 2
        return int(half_lane + side * distance_to_half)
