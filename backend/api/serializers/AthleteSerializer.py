from api.models import Athlete
from rest_framework import serializers
from django.utils import timezone


class AthleteSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)


    class Meta:
        model = Athlete
        fields = '__all__'

    # Validate that the date is not in the future
    def validate_date_of_birth(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value