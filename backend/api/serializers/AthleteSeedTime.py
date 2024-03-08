from api.models import Athlete
from rest_framework import serializers
from django.utils import timezone


class AthleteSeedTimeSerializer(serializers.Serializer):
    athlete = serializers.PrimaryKeyRelatedField(queryset=Athlete.objects.all())
    athlete_full_name = serializers.CharField()
    seed_time = serializers.CharField()