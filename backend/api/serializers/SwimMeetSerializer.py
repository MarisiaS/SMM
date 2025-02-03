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
                "site_name": "Flying Fish",
                "num_lanes": 5
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
                "num_lanes": 4
            },
            request_only=True,
            ),
    ]
)
class SwimMeetSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    site_name = serializers.ReadOnlyField(source="site.name")

    class Meta:
        model = SwimMeet
        fields = ('id', 'name', 'date', 'time', 'site', 'site_name', 'num_lanes')

    def validate(self, data):
        site = data.get("site")
        num_lanes = data.get("num_lanes")

        if site and num_lanes and num_lanes > site.num_lanes:
            raise serializers.ValidationError({
                'num_lanes': f"The number of lanes cannot exceed the site's number of lanes ({site.num_lanes})."
            })

        return data

        
    
