from rest_framework import status
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiExample
from api.models import Enrollment, SwimMeet, Athlete
from api.serializers.EnrollmentSerializer import UnenrollAthleteSerializer, EnrollAthletesListSerializer
from api.serializers.AthleteSerializer import AthleteSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from django.db import transaction


@extend_schema(tags=['Swim Meet - Enrollment'])
class MeetEnrolledAthletes(APIView):

    @extend_schema(methods=['GET'],
                   summary="List enrolled athletes on a swim meet",
                   description="Lists all the athletes enrolled on a specific meet, ordered alphabetically by name")
    def get(self, request, meet_id):
        if not SwimMeet.objects.filter(id=meet_id).exists():
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)

        athletes = Athlete.objects.filter(
            athlete_swim_meets__swim_meet=meet_id).order_by('first_name', 'last_name')

        serializer = AthleteSerializer(athletes, many=True)
        return Response(serializer.data)

    @extend_schema(methods=['POST'],
                   request=EnrollAthletesListSerializer,
                   summary="Enroll a list of athletes to a specific swim meet",
                   description="Accepts a list of athlete IDs that are not already enrolled in the swim meet and enrolls them",
                   )
    @transaction.atomic
    def post(self, request, meet_id):
        if not SwimMeet.objects.filter(id=meet_id).exists():
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)

        athlete_ids = request.data.get('athlete_ids', [])

        if not isinstance(athlete_ids, list):
            return Response({'error': 'athlete_ids must be a list'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = EnrollAthletesListSerializer(
            data=request.data, context={'meet_id': meet_id})

        if serializer.is_valid():
            athlete_ids = serializer.validated_data['athlete_ids']

            enrollments = [Enrollment(
                swim_meet_id=meet_id, athlete_id=athlete_id) for athlete_id in athlete_ids]
            Enrollment.objects.bulk_create(enrollments)

            return Response({"success": "Athlete(s) enrolled successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(methods=['PATCH'],
                   request=UnenrollAthleteSerializer,
                   examples=[
                   OpenApiExample(
                       "Example Value",
                       summary="Example of a Patch request",
                       value={
                           "athlete_id": 1,
                       },
                   )],
                   summary="Unenroll an Athlete from a specific swim meet",
                   description="Accepts an athlete ID already enrolled on the swim meet and unenrolls them")
    def patch(self, request, meet_id):
        if not SwimMeet.objects.filter(id=meet_id).exists():
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UnenrollAthleteSerializer(
            data=request.data, context={"meet_id": meet_id})
        if serializer.is_valid():
            athlete_id = serializer.validated_data['athlete_id']
            Enrollment.objects.filter(
                swim_meet_id=meet_id, athlete_id=athlete_id).delete()
            return Response({"success": "Athlete unenrolled successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['Swim Meet - Enrollment'])
class MeetUnenrolledAthletes(APIView):

    @extend_schema(
        summary="List active athletes not enrolled in a swim meet",
        description="Returns a list of active athletes not enrolled on a specified swim meet, ordered alphabetically by name",
    )
    def get(self, request, meet_id):
        if not SwimMeet.objects.filter(id=meet_id).exists():
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)
        enrolled_athletes = Enrollment.objects.filter(
            swim_meet=meet_id).values_list("athlete_id", flat=True)
        active_athletes = Athlete.objects.exclude(
            id__in=enrolled_athletes).order_by('first_name', 'last_name')

        serializer = AthleteSerializer(active_athletes, many=True)
        return Response(serializer.data)
