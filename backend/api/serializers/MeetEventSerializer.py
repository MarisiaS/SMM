from api.models import MeetEvent
from rest_framework import serializers

class MeetEventSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, read_only=True)
    group_name = serializers.ReadOnlyField(source="group.name")
    event_type_name = serializers.ReadOnlyField(source="event_type.name")
    num_heats = serializers.IntegerField(source="heat_event.count", read_only=True)


    class Meta:
        model = MeetEvent
        fields = ('id', 'swim_meet', 'num_event', 'name', 'group', 'group_name', 'event_type', 'event_type_name', 'num_heats' )
        
        extra_kwargs = {
            'swim_meet': {'write_only': True},
        }
        
    def validate(self, data):
        data = self.validate_unique_constrains(data)
        return super().validate(data)
    
    def validate_unique_constrains(self, data):
        swim_meet = data.get('swim_meet')
        group = data.get('group')
        event_type = data.get('event_type')
        num_event = data.get('num_event')

        # Check unique constraint: 'unique_num_event_swim_meet'
        if MeetEvent.objects.filter(swim_meet=swim_meet, num_event=num_event).exists():
            raise serializers.ValidationError({'Event with this number already exists for the swim meet.'})

        # Check unique constraint: 'unique_group_event_type_swim_meet'
        if MeetEvent.objects.filter(swim_meet=swim_meet, group=group, event_type=event_type).exists():
            raise serializers.ValidationError({'Event with this group and event_type already exists for the swim meet.'})

        return data

class MeetEventPatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeetEvent
        fields = ('num_event',)
        
        