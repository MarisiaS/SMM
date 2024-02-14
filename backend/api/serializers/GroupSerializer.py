from api.models import Group
from rest_framework import serializers
from api.CustomField import BlankableIntegerField


class GroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    min_age = BlankableIntegerField(required=False)
    max_age = BlankableIntegerField(required=False)

    class Meta:
        model = Group
        fields = ('id', 'name', 'gender', 'min_age', 'max_age')

    def validate(self, data):
        data = self.validate_age(data)
        data = self.validate_unique_group(data)
        return super().validate(data)

    def validate_age(self, data):
        """
        Validation of min_age is less that max_age.
        """
        min_age = data.get('min_age', None)
        max_age = data.get('max_age', None)
        if min_age is not None and min_age <= 0:
            raise serializers.ValidationError({'min_age': "Min age must be greater than 0."})

        if max_age is not None and max_age <= 0:
            raise serializers.ValidationError({'max_age': "Max age must be greater than 0."})

        if min_age is not None and max_age is not None and min_age > max_age:
            raise serializers.ValidationError({
                    'min_age': "Min age must be less than or equal to max age.",
                    'max_age': "Max age must be greater than or equal to min age."
                })
        return data

    def validate_unique_group(self, data):
        # Check if the combination of min_age, max_age, and gender is unique
        min_age = data.get('min_age', None)
        max_age = data.get('max_age', None)
        gender = data.get('gender')

        if Group.objects.filter(
            min_age=min_age,
            max_age=max_age,
            gender=gender
        ).exists():
            raise serializers.ValidationError("A group with this caracteristics already exists.")
        return data
