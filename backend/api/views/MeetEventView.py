from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, SwimMeet
from api.serializers.MeetEventSerializer import MeetEventListSerializer, EventGroupSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Meet Events'])
class MeetEventListView(APIView):
    def get(self, request, meet_id):
        try:
            meet_events = MeetEvent.objects.filter(meet_id=meet_id).order_by('num_event')
        except MeetEvent.DoesNotExist:
            return Response({'error': 'MeetEvent not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetEventListSerializer(meet_events, many=True)
        return Response(serializer.data)
    
@extend_schema(tags=['Meet Events'], request=EventGroupSerializer)
class AddEventToMeetView(APIView):
    def post(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.filter(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventGroupSerializer(data=request.data)
        if serializer.is_valid():
            num_event = MeetEvent.objects.filter(meet_id=meet_id).count()
            group_id = serializer.validated_data['group_id']
            event_type_id = serializer.validated_data['event_type_id']
            print(num_event)
            MeetEvent.objects.create(meet_id=meet_id, group_id=group_id, event_type_id=event_type_id, num_event=num_event+1)
            return Response({'success': 'Event added to the swim meet'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
