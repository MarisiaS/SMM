from api.models import Athlete
from rest_framework import serializers
from django.utils import timezone


class AthleteSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    full_name = serializers.CharField(read_only=True)
    age = serializers.IntegerField(read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)


    class Meta:
        model = Athlete
        fields = '__all__'
        read_only_fields = ['full_name', 'age','gender_display']

    # Validate that the date is not in the future
    def validate_date_of_birth(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value