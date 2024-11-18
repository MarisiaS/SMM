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

        For heat results:
            -NS represents a No show to the heat
            -DQ represents that the athlete was disquialified
            -A positive duration
        """
        if value is None or value == '':
            return None
        # Disqualified
        elif value == 'DQ':
            return serializers.DurationField().to_internal_value('400 0:0.0')
        # No show
        elif value == 'NS':
            return serializers.DurationField().to_internal_value('300 0:0.0')
        # No Time
        elif value == 'NT':
            return serializers.DurationField().to_internal_value('200 0:0.0')
        else:
            return super().to_internal_value(value)

    def to_representation(self, value):
        if value is None:
            return None
        elif value == serializers.DurationField().to_internal_value('400 0:0.0'):
            return 'DQ'
        elif value == serializers.DurationField().to_internal_value('300 0:0.0'):
            return 'NS'
        elif value == serializers.DurationField().to_internal_value('200 0:0.0'):
            return 'NT'
        else:
            return super().to_representation(value)
