from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, SwimMeet
from api.serializers.MeetEventSerializer import MeetEventSerializer, MeetEventPostSerializer, MeetEventPatchSerializer
from django.db.models import F
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Meet Events'])
@extend_schema(request=MeetEventPostSerializer, methods=['GET'], summary="Displays all events in a specific meet")
@extend_schema(request=MeetEventPostSerializer, methods=['POST'], summary="Add an event to a specific meet")
@extend_schema(request=MeetEventPatchSerializer, methods=['PATCH'], summary="Deletes an event from a specific meet and updates the event number for the next events")
class MeetEventView(APIView):
    def get(self, request, meet_id):
        try:
            meet_events = MeetEvent.objects.filter(meet_id=meet_id).order_by('num_event')
        except MeetEvent.DoesNotExist:
            return Response({'error': 'MeetEvent not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetEventSerializer(meet_events, many=True)
        return Response(serializer.data)

    def post(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetEventPostSerializer(data=request.data)
        if serializer.is_valid():
            num_event = MeetEvent.objects.filter(meet_id=meet_id).count()
            serializer.validated_data['num_event'] = num_event + 1
            serializer.validated_data['meet'] = swim_meet
            serializer.save()
            return Response({'success': 'Event added to the swim meet'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetEventPatchSerializer(data=request.data)
        if serializer.is_valid():
            num_event_to_delete = serializer.validated_data.get('num_event')
            try:
                event_to_delete = MeetEvent.objects.get(meet=swim_meet, num_event=num_event_to_delete)
            except MeetEvent.DoesNotExist:
                return Response({'error': 'Event not found for the specified num_event'}, status=status.HTTP_404_NOT_FOUND)
            event_to_delete.delete()
            MeetEvent.objects.filter(meet=swim_meet, num_event__gt=num_event_to_delete).update(num_event=F('num_event') - 1)

            return Response({'success': 'Event deleted and num_event updated for remaining events'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
