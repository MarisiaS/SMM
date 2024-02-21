from api.models import SwimMeet
from rest_framework import serializers


class SwimMeetSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    site_name = serializers.ReadOnlyField(source="site.name")

    class Meta:
        model = SwimMeet
        fields = ('id', 'name', 'date', 'time', 'site', 'site_name')

        
    
