from rest_framework import serializers
       

class BlankableTimeField(serializers.TimeField):
    def to_internal_value(self, value):
        if value == '':
            return None
        return super().to_internal_value(value)