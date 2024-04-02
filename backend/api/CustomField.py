from rest_framework import serializers
       

class BlankableTimeField(serializers.TimeField):
    def to_internal_value(self, value):
        if value == '':
            return None
        return super().to_internal_value(value)
    
class BlankableIntegerField(serializers.IntegerField):
    def to_internal_value(self, value):
        if value == '':
            return None
        return super().to_internal_value(value)
    
class HeatDurationField(serializers.DurationField):
    def to_internal_value(self, value):
        """
        For seed times the option are:
            -NT when the athlete does not have a time register for that event type.
            -A positive duration
            -"" when the is an empty lane

        For heat results:
            -NS represents a No show to the heat
            -DQ represents that the athlete was disquialified
            -A positive duration
        """
        # Empty time
        if value == "":
            return serializers.DurationField().to_internal_value('500 0:0.0')
        # No show
        elif value == 'DQ':
            return serializers.DurationField().to_internal_value('400 0:0.0') 
        # Disqualified
        elif value == 'NS':
            return serializers.DurationField().to_internal_value('300 0:0.0')
        # No Time
        elif value == 'NT':
            return serializers.DurationField().to_internal_value('200 0:0.0')
        else:
            return super().to_internal_value(value)

    def to_representation(self, value):
        if value == serializers.DurationField().to_internal_value('500 0:0.0'):
            return ""
        elif value == serializers.DurationField().to_internal_value('400 0:0.0'):
            return 'DQ'
        elif value == serializers.DurationField().to_internal_value('300 0:0.0'):
            return 'NS'
        elif value == serializers.DurationField().to_internal_value('200 0:0.0'):
            return 'NT'
        else:
            return super().to_representation(value)