from rest_framework import status
from rest_framework.generics import GenericAPIView
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter
from api.models import Enrollment, SwimMeet, Athlete, Heat
from api.serializers.EnrollmentSerializer import UnenrollAthleteSerializer, EnrollAthletesListSerializer
from api.serializers.AthleteSerializer import AthleteSerializer
from rest_framework.response import Response
from drf_spectacular.types import OpenApiTypes
from django.db import transaction
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.filters import SearchFilter
from django.db.models.functions import Collate
from datetime import timedelta
from django.db.models import Q


@extend_schema(tags=['Swim Meet - Enrollment'])
class MeetEnrolledAthletes(GenericAPIView):
    serializer_class = AthleteSerializer
    filter_backends = [SearchFilter]
    search_fields = ['^first_name_search', '^last_name_search']

    @extend_schema(methods=['GET'],
                   parameters=[
        OpenApiParameter(
            name='search',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Search by first name or last name.',
        ),
        OpenApiParameter(
            name='limit',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Number of results to return per page.',
        ),
        OpenApiParameter(
            name='offset',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='The initial index from which to return the results.',
        ),
    ],
        summary="List enrolled athletes on a swim meet",
        description="Lists all the athletes enrolled on a specific meet, ordered alphabetically by first name and last name")
    def get(self, request, meet_id):
        if not SwimMeet.objects.filter(id=meet_id).exists():
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)

        athletes = Athlete.objects.filter(
            athlete_swim_meets__swim_meet=meet_id
        ).annotate(
            first_name_search=Collate("first_name", "und-x-icu"),
            last_name_search=Collate("last_name", "und-x-icu")
        ).order_by('first_name', 'last_name')

        filtered_athletes = self.filter_queryset(athletes)

        paginator = LimitOffsetPagination()
        paginated_query_set = paginator.paginate_queryset(
            filtered_athletes, request)

        serializer = AthleteSerializer(paginated_query_set, many=True)
        return paginator.get_paginated_response(serializer.data)

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
                   description=(
        "Removes an athlete from a specific swim meet. "
        "The athlete must already be enrolled and must not have competed in any events within the meet. "
        "All associated heat entries will be deleted if eligible."
    ))
    def patch(self, request, meet_id):
        if not SwimMeet.objects.filter(id=meet_id).exists():
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UnenrollAthleteSerializer(
            data=request.data, context={"meet_id": meet_id})

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        athlete_id = serializer.validated_data['athlete_id']

        try:
            with transaction.atomic():
                heats = Heat.objects.filter(
                    athlete_id=athlete_id,
                    event__swim_meet_id=meet_id
                )

                has_competed = heats.filter(
                    ~Q(heat_time__isnull=True) & ~Q(
                        heat_time=timedelta(days=300))
                ).exists()
                if has_competed:
                    raise Exception(
                        'Athlete cannot be unenrolled because they have already competed.')
                heats.delete()
                Enrollment.objects.filter(
                    swim_meet_id=meet_id, athlete_id=athlete_id
                ).delete()
            return Response({"success": "Athlete unenrolled successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['Swim Meet - Enrollment'])
class MeetUnenrolledAthletes(GenericAPIView):

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
