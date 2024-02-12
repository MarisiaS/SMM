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

    def validate_age(self, data):
        """
        Validation of min_age is less that max_age.
        """
        min_age = data.get('min_age', None)
        max_age = data.get('max_age', None)
        if min_age and max_age and min_age > max_age:
            raise serializers.ValidationError("Minimum age can not be greater that maximum age")
        return data

    def validate_unique_group(self, data):
        # Check if the combination of min_age, max_age, and gender is unique
        min_age = data.get('min_age', "")
        max_age = data.get('max_age', "")
        gender = data.get('gender')

        if Group.objects.filter(
            min_age=min_age,
            max_age=max_age,
            gender=gender
        ).exists():
            raise serializers.ValidationError("A group qith this caracteristics already exists.")
        return data
