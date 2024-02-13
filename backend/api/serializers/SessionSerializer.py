from api.models import Session
from rest_framework import serializers



class SessionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Session
        fields = ('id', 'name', 'days_of_week', 'time', 'coach', 'school')
    

    def validate_days_of_week(self, value):
        if len(value) != 7:
            raise serializers.ValidationError("Days of the week has to have a lenght of 7")
        if not all(isinstance(day, bool) for day in value):
            raise serializers.ValidationError("All elements in days_of_week must be booleans.")
        if not any(value):
            raise serializers.ValidationError("At least a day of the week has to be chosen.")
        return value
    
     