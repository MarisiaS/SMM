from api.models import School
from rest_framework import serializers
from api.CustomField import BlankableTimeField


class SchoolSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    open_hour = BlankableTimeField(required=False)
    close_hour = BlankableTimeField(required=False)

    class Meta:
        model = School
        fields = ('id', 'name', 'open_hour', 'close_hour')

    # Validate that name is unique, if not raise a Validation Error
    def validate_name(self, value):
        if self.instance and self.instance.name == value:
            return value  # No change, no validation needed for the same name

        if School.objects.filter(name=value).exists():
            raise serializers.ValidationError('Duplicate value, it already exists.')

        return value