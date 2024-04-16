from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, Heat, Group, Athlete
from api.serializers.GenerateHeatSerializer import GenerateHeatSerializer
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema
from django.db import transaction
from django.db.models import F, Value, Func, IntegerField
from django.utils import timezone


@extend_schema(tags=['Heat'])
@extend_schema(request=GenerateHeatSerializer, methods=['POST'])
class GenerateHeatView(APIView):
    @extend_schema(summary="Given an event and a list of participants with their seed times, generates the heats")
    def post(self, request, event_id):
        #Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        #The event should not have heats
        if Heat.objects.filter(event=event_instance).exists():
            return Response({'error': 'Event already has heats'}, status=status.HTTP_400_BAD_REQUEST)
       
        #Get num_lanes
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.site.num_lanes
        except:
            return Response({'error': 'Not able to retrieve number of lanes'}, status=status.HTTP_404_NOT_FOUND)
        
        #Get group_id
        try:
            group_instance = event_instance.group
        except:
            return Response({'error': 'Not able to retrieve group'}, status=status.HTTP_404_NOT_FOUND)
        
       
        serializer = GenerateHeatSerializer(data=request.data, context={'num_lanes': num_lanes, 'event': event_instance})
        if serializer.is_valid(raise_exception=True):
            #Before saving, check that the given athletes are part of the event group
            athletes_data = request.data.get('athletes', [])
            queryset = self.get_queryset(group_instance.id)
            queryset_athlete_ids = set(queryset.values_list('id', flat=True))
            request_athlete_ids = {athlete['athlete'] for athlete in athletes_data}
            if not request_athlete_ids.issubset(queryset_athlete_ids):
                return Response({'error': 'One or more athletes are not part of the specified group for the event.'}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
        return Response({'success': 'Heats generated'}, status=status.HTTP_200_OK)
    
    @extend_schema(summary="Deletes the heats for a given event")
    @transaction.atomic
    def delete(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            Heat.objects.filter(event=event_instance).delete()
        except Exception as e:
            transaction.set_rollback(True)
            return Response({'error': f'Failed to delete heats: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'success': 'Associated heats deleted'}, status=status.HTTP_200_OK)

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
            
        return queryset
