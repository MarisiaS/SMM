from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Athlete, TimeRecord, MeetEvent, Group, EventType
from api.serializers.AthleteSeedTimeSerializer import AthleteSeedTimeSerializer, UpdateAthleteSeedTimeSerializer
from django.db.models import F, Value, Func, IntegerField
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework.pagination import LimitOffsetPagination
from datetime import timedelta

@extend_schema(tags=['Seed times'])
class AthleteSeedTimeView(APIView):
    def get_queryset(self, group_id):
        try:
            group_instance = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            raise ValidationError({'error': "Group does not exist"}, code=status.HTTP_400_BAD_REQUEST)
        queryset = Athlete.objects.all()
        queryset = queryset.annotate(
                age=Func(
                    Value("year"),
                    Func(Value(timezone.now().date()), F(
                        "date_of_birth"), function="age"),
                    function="date_part",
                    output_field=IntegerField()))
        
        gender = group_instance.gender
        if gender != 'MX':
            queryset = queryset.filter(gender=gender)
        min_age = group_instance.min_age
        max_age = group_instance.max_age
        if max_age is not None:
            queryset = queryset.filter(age__lte=max_age)
        if min_age is not None:
            queryset = queryset.filter(age__gte=min_age)
            
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
                   summary="Retrieve a list of eligible athletes for a specific event along with their seed times")
    def get(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        #Getting the group and event_type
        group_id = event_instance.group.id
        event_type_id = event_instance.event_type.id
        
        #Checking that the event type exists
        try:
            event_type_instance = EventType.objects.get(id=event_type_id)
        except EventType.DoesNotExist:
            return Response({'error': 'Event type not found'}, status=status.HTTP_404_NOT_FOUND)

        #On get_queryset we validate if the group exists and filter by group
        athletes = self.get_queryset(group_id)
        seed_times = []

        for athlete in athletes:
            time_records = TimeRecord.objects.filter(athlete=athlete, event_type=event_type_instance).order_by('time')
            if time_records.exists():
                seed_time = time_records.first()
                seed_times.append({'id': athlete.id, 'athlete_full_name': athlete.full_name, 'seed_time': seed_time.time})
            else:
                # The serializer interpretes 200 days as NT (No time)
                seed_times.append({'id': athlete.id, 'athlete_full_name': athlete.full_name, 'seed_time': timedelta(days=200)})

        paginator = LimitOffsetPagination()
        paginated_seed_times = paginator.paginate_queryset(seed_times, request)

        # Serialize the paginated data
        serializer = AthleteSeedTimeSerializer(data=paginated_seed_times, many=True)
        serializer.is_valid(raise_exception=True)

        # Return the paginated response
        return paginator.get_paginated_response(serializer.data)

    @extend_schema(request=UpdateAthleteSeedTimeSerializer,
                   summary="Record or update the seed time for a specific athlete in the given event")
    def post(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        #Checking that the event type exists
        try:
            event_type_instance = EventType.objects.get(id=event_instance.event_type.id)
        except EventType.DoesNotExist:
            return Response({'error': 'Event type not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateAthleteSeedTimeSerializer(data=request.data, context={'event_type':event_type_instance})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'success': 'Time registered.'}, status=status.HTTP_200_OK)