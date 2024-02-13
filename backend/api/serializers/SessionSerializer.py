from api.models import Session
from rest_framework import serializers



class SessionSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = Session
        fields = ('id', 'name', 'days_of_week', 'coach', 'school')

    def validate(self, data):
        data = self.validate_days_of_week(data)
        return super().validate(data)
    
    
    # Validate that at least one day of the week is chosen, if not raise a Validation Error
    def validate_days_of_week(self, data):
        days = data.get('days_of_week', [])
        if not any(days):
           raise serializers.ValidationError("At least a day of the week has to be chosen.")
        return data
    
     