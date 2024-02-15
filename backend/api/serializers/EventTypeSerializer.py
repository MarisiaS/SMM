from rest_framework import serializers
from api.models import EventType  

class EventTypeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    distance = serializers.IntegerField(required=True)
    stroke = serializers.ChoiceField(choices=EventType.Stroke.choices,required=True)
    type = serializers.ChoiceField(choices=EventType.Type.choices, required=True)


    class Meta:
        model = EventType
        fields = ('id', 'name', 'distance', 'stroke', 'type')

    def validate(self, data):
        data = self.validate_unique_event_type(data)
        return super().validate(data)
    
    def validate_unique_event_type(self, data):
        # Check if the combination of min_age, max_age, and gender is unique
        distance = data.get('distance')
        stroke = data.get('stroke')
        type = data.get('type')

        if EventType.objects.filter(
            distance=distance,
            stroke=stroke,
            type=type
            ).exists():
                raise serializers.ValidationError("An Event Type with these caracteristics already exists.")
        return data
    
    def validate_distance(self, value):
        if value <= 0:
            raise serializers.ValidationError("Distance must be a positive number greater than zero.")
        return value
