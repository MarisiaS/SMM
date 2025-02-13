from rest_framework import serializers
from api.models import Enrollment, Athlete


class EnrollAthletesListSerializer(serializers.Serializer):
    athlete_ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False)

    def validate_athlete_ids(self, value):
        swim_meet_id = self.context.get('meet_id')
        if not swim_meet_id:
            raise serializers.ValidationError(
                "Swim meet id is required for validation")

        athlete_ids_set = set(value)

        # Check if all athletes_ids exist
        existing_athletes_ids = set(
            Athlete.objects.filter(
                id__in=athlete_ids_set).values_list('id', flat=True)
        )

        invalid_ids = athlete_ids_set - existing_athletes_ids

        if invalid_ids:
            raise serializers.ValidationError(
                f"Invalid athletes ids: {list(invalid_ids)}")

        # Get enrolled athlete_ids for the swim meet
        enrolled_athletes_ids = set(
            Enrollment.objects.filter(swim_meet_id=swim_meet_id)
            .values_list('athlete_id', flat=True)
        )

        already_enrolled = athlete_ids_set & enrolled_athletes_ids  # Intersection

        if already_enrolled:
            raise serializers.ValidationError(
                f"Athlete(s) already enrolled in this swim meet: {list(already_enrolled)}"
            )
        return list(athlete_ids_set)


class UnenrollAthleteSerializer(serializers.Serializer):
    athlete_id = serializers.IntegerField()

    def validate_athlete_id(self, value):
        swim_meet_id = self.context.get('meet_id')

        if not swim_meet_id:
            raise serializers.ValidationError(
                "Swim meet id is required for validation")

        if not Athlete.objects.filter(id=value).exists():
            raise serializers.ValidationError("Athlete not found")

        if not Enrollment.objects.filter(swim_meet=swim_meet_id, athlete=value).exists():
            raise serializers.ValidationError(
                "Athlete is not enrolled in this swim meet")
        return value
