from api.models import TimeRecord
from rest_framework import serializers
import re


class TimeRecordSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = TimeRecord
        fields = ('id', 'athlete', 'event_type', 'swim_meet', 'time', 'date')

    def validate_time(self, value):
        # validation for time format MM:SS.mmm
        if not re.match(r'^\d{2}:\d{2}\.\d{3}$', value):
            raise serializers.ValidationError("Invalid time format. Use MM:SS.mmm")

        return value
    
