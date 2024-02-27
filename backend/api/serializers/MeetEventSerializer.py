from api.models import MeetEvent, EventType, Group, SwimMeet
from rest_framework import serializers


class MeetEventListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    group_name = serializers.ReadOnlyField(source="group.name")
    event_type_name = serializers.ReadOnlyField(source="event_type.name")

    class Meta:
        model = MeetEvent
        fields = ('id', 'num_event', 'name', 'group', 'group_name', 'event_type', 'event_type_name' )
        
class EventGroupSerializer(serializers.Serializer):
    event_type_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    
    def validate_group_id(self, value):
        try:
            # Check if group with group_id exists
            group = Group.objects.get(id=value)
        except Group.DoesNotExist:
            raise serializers.ValidationError(f"Group with id {value} does not exist.")
        
        return value
    
    def validate_event_type_id(self, value):
        try:
            # Check if event_type with event_type_id exists
            event_type = EventType.objects.get(id=value)
        except Group.DoesNotExist:
            raise serializers.ValidationError(f"Event type with id {value} does not exist.")
        
        return value