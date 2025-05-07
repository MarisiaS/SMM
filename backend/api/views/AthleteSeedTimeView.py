from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Athlete, TimeRecord, MeetEvent, EventType
from api.serializers.AthleteSeedTimeSerializer import AthleteSeedTimeSerializer, UpdateAthleteSeedTimeSerializer
from api.CustomFilter import filter_by_group
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from datetime import timedelta


@extend_schema(tags=['Seed times'])
class AthleteSeedTimeView(APIView):
    def get_queryset(self, meet_id, group_id, date_of_swim_meet):
        queryset = Athlete.objects.filter(
            athlete_swim_meets__swim_meet=meet_id)
        queryset = filter_by_group(
            group_id=group_id, queryset=queryset, date=date_of_swim_meet, from_athlete_model=True)

        return queryset.order_by('first_name')

    @extend_schema(methods=['GET'],
                   request=AthleteSeedTimeSerializer,
                   parameters=[
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
        summary="Retrieve the list of athletes enrolled in the swim meet, including their corresponding seed times for the given event.")
    def get(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Getting the group and event_type
        group_id = event_instance.group.id
        event_type_id = event_instance.event_type.id
        date_of_swim_meet = event_instance.swim_meet.date

        # Getting the meet id
        meet_id = event_instance.swim_meet

        # Checking that the event type exists
        try:
            event_type_instance = EventType.objects.get(id=event_type_id)
        except EventType.DoesNotExist:
            return Response({'error': 'Event type not found'}, status=status.HTTP_404_NOT_FOUND)

        # On get_queryset we get the athletes enrolled in the swim meet and filtered by the group
        athletes = self.get_queryset(meet_id, group_id, date_of_swim_meet)
        seed_times = []

        for athlete in athletes:
            time_records = TimeRecord.objects.filter(
                athlete=athlete, event_type=event_type_instance).order_by('time')
            seed_time = time_records.first() or None
            if seed_time and seed_time.time < timedelta(days=200):
                seed_times.append(
                    {'id': athlete.id, 'athlete_full_name': athlete.full_name, 'seed_time': seed_time.time})
            else:
                # The serializer interpretes 200 days as NT (No time)
                seed_times.append(
                    {'id': athlete.id, 'athlete_full_name': athlete.full_name, 'seed_time': timedelta(days=200)})

        serializer = AthleteSeedTimeSerializer(data=seed_times, many=True)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=UpdateAthleteSeedTimeSerializer,
                   summary="Record or update the seed time for a specific athlete in the given event")
    def post(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Checking that the event type exists
        try:
            event_type_instance = EventType.objects.get(
                id=event_instance.event_type.id)
        except EventType.DoesNotExist:
            return Response({'error': 'Event type not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateAthleteSeedTimeSerializer(
            data=request.data, context={'event_type': event_type_instance})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'success': 'Time registered.'}, status=status.HTTP_200_OK)
