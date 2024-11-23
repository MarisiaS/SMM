from api.models import SwimMeet
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            name='respose',
            value={
                "id": 2,
                "name": "Spring Swim Meet",
                "date": "2024-03-16",
                "time": "17:00:00",
                "site": 1,
                "site_name": "Flying Fish"
            },
            response_only=True,  # signal that example only applies to responses
            ),
        OpenApiExample(
            name='request',
            value={
                "name": "Spring Swim Meet",
                "date": "2024-03-16",
                "time": "17:00:00",
                "site": 1,
            },
            request_only=True,
            ),
    ]
)
class SwimMeetSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    site_name = serializers.ReadOnlyField(source="site.name")
    site_num_lanes = serializers.ReadOnlyField(source="site.num_lanes")

    class Meta:
        model = SwimMeet
        fields = ('id', 'name', 'date', 'time', 'site', 'site_name', 'site_num_lanes')

        
    
