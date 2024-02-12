from api.models import Group
from rest_framework import serializers


class BlankableIntegerField(serializers.IntegerField):
    def to_internal_value(self, value):
        if value == '':
            return None
        return super().to_internal_value(value)


class GroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    min_age = BlankableIntegerField(required=False)
    max_age = BlankableIntegerField(required=False)

    class Meta:
        model = Group
        fields = ('id', 'name', 'gender', 'min_age', 'max_age')

    def validate(self, data):
        """
        Validation of min_age is less that max_age.
        """
        min_age = data.get('min_age', None)
        max_age = data.get('max_age', None)
        if min_age and max_age and min_age > max_age:
            raise serializers.ValidationError("Minimum age can not be greater that maximum age")
        return data
