from api.models import Athlete, TimeRecord
from rest_framework import serializers
from django.utils import timezone
from api.CustomField import HeatDurationField
from datetime import timedelta
from rest_framework.exceptions import ValidationError


class AthleteSeedTimeSerializer(serializers.Serializer):
    athlete = serializers.PrimaryKeyRelatedField(queryset=Athlete.objects.all())
    athlete_full_name = serializers.CharField()
    seed_time = HeatDurationField()

class UpdateAthleteSeedTimeSerializer(serializers.Serializer):
    athlete = serializers.PrimaryKeyRelatedField(queryset=Athlete.objects.all())
    date = serializers.DateTimeField()
    time = serializers.DurationField()

    def validate_time(self, value):
        # timedelta object with zero duration for comparasion purposes
        zero_duration = timedelta()
        if value <= zero_duration:
            raise serializers.ValidationError("Time cannot be zero or negative.")
        return value
    
    def create(self,validated_data):
        try:
            record_instance = TimeRecord.objects.create(
                athlete = validated_data.get('athlete'),
                event_type = self.context['event_type'],
                time = validated_data.get('time'),
                date = validated_data.get('date')
            )
            return record_instance
        except Exception as e:
            raise ValidationError("Failed to create TimeRecord: {}".format(str(e)))