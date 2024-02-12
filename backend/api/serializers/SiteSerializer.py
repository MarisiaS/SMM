from api.models import Site
from rest_framework import serializers


class SiteSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)

    class Meta:
        model = Site
        fields = ('id', 'name', 'num_lanes', 'pool_len', 'len_unit')

    # Validate that name is unique, if not raise a Validation Error
    def validate_name(self, value):
        if self.instance and self.instance.name == value:
            return value  # No change, no validation needed for the same name

        if Site.objects.filter(name=value).exists():
            raise serializers.ValidationError('Duplicate value, it already exists.')

        return value