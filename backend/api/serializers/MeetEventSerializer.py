from api.models import MeetEvent
from rest_framework import serializers


class MeetEventSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, read_only=True)
    group_name = serializers.ReadOnlyField(source="group.name")
    event_type_name = serializers.ReadOnlyField(source="event_type.name")
    num_event = serializers.ReadOnlyField()

    class Meta:
        model = MeetEvent
        fields = ('id', 'num_event', 'name', 'group', 'group_name', 'event_type', 'event_type_name' )

class MeetEventPatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeetEvent
        fields = ('num_event',)
        
        