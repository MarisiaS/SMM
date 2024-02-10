from api.models import Site
from rest_framework import serializers


class SiteSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)

    class Meta:
        model = Site
        fields = ('name', 'num_lanes', 'pool_len', 'len_unit')
