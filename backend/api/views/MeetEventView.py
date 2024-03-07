from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, SwimMeet
from api.serializers.MeetEventSerializer import MeetEventSerializer, MeetEventPatchSerializer
from django.db.models import F
from drf_spectacular.utils import extend_schema, OpenApiExample

@extend_schema(tags=['Swim Meet - Events'])
class MeetEventView(APIView):
    
    @extend_schema(methods=['GET'], request=MeetEventSerializer, summary="Displays all events in a specific meet")
    def get(self, request, meet_id):
        try:
            meet_events = MeetEvent.objects.filter(swim_meet_id=meet_id).order_by('num_event')
        except MeetEvent.DoesNotExist:
            return Response({'error': 'MeetEvent not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetEventSerializer(meet_events, many=True)
        return Response(serializer.data)

    @extend_schema(methods=['POST'],
                   request=MeetEventSerializer,
                   examples=[
                   OpenApiExample(
                       "Example Value",
                       summary="Example of a POST request",
                       value={
                           "group": 1,
                           "event_type": 1
                       },
                    )], 
                   summary="Add an event to a specific meet")
    def post(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        num_event = MeetEvent.objects.filter(swim_meet_id=meet_id).count()
        event_data ={
            "swim_meet": swim_meet.id,
            "group": data.get('group'),
            'event_type': data.get('event_type'),
            'num_event': num_event + 1
        }
        serializer = MeetEventSerializer(data=event_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Event added to the swim meet'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @extend_schema(methods=['PATCH'],
                   request=MeetEventPatchSerializer,
                   examples=[
                   OpenApiExample(
                       "Example Value",
                       summary="Example of a Patch request",
                       value={
                           "num_event": 1,
                       },
                    )], 
                   summary="Deletes an event from a specific meet and updates the event number for the next events")    
    def patch(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = MeetEventPatchSerializer(data=request.data)
        if serializer.is_valid():
            num_event_to_delete = serializer.validated_data.get('num_event')
            try:
                event_to_delete = MeetEvent.objects.get(swim_meet=swim_meet, num_event=num_event_to_delete)
            except MeetEvent.DoesNotExist:
                return Response({'error': 'Event not found for the specified num_event'}, status=status.HTTP_404_NOT_FOUND)
            event_to_delete.delete()
            MeetEvent.objects.filter(swim_meet=swim_meet, num_event__gt=num_event_to_delete).update(num_event=F('num_event') - 1)

            return Response({'success': 'Event deleted and num_event updated for remaining events'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
