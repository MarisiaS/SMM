from api.models import School, SwimMeet
from rest_framework import serializers
from django.db import transaction


class BasicSchoolSerializer(serializers.ModelSerializer):

    class Meta:
        model = School
        fields = ('id', 'name')


class MeetSchoolListSerializer(serializers.ModelSerializer):
    schools = BasicSchoolSerializer(source='school', many=True)
    
    class Meta:
        model = SwimMeet
        fields = ('id', 'name', 'schools',)


class SchoolsListSerializer(serializers.Serializer):
    school_ids = serializers.ListField(child=serializers.IntegerField())

    def validate_school_ids(self, value):
        # Check if all school_ids exist
        existing_school_ids = School.objects.values_list('id', flat=True)
        invalid_ids = set(value) - set(existing_school_ids)

        if invalid_ids:
            raise serializers.ValidationError(f"Invalid school IDs: {list(invalid_ids)}")

        return value     


