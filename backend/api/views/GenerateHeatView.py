from rest_framework.response import Response
from rest_framework import status
from api.models import Athlete, TimeRecord, MeetEvent, Group, EventType, SwimMeet
from api.serializers.GenerateHeatSerializer import GenerateHeatSerializer
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema


@extend_schema(tags=['Heat'])
@extend_schema(request=GenerateHeatSerializer, methods=['POST'])
class GenerateHeatView(APIView):
    def post(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
       
        #Get num_lanes
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.site.num_lanes
        except:
            return Response({'error': 'Not able to retrive number of lanes'}, status=status.HTTP_404_NOT_FOUND)


       
        serializer = GenerateHeatSerializer(data=request.data,context={'num_lanes': num_lanes, 'event': event_instance})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response({'success': 'Heats generated'}, status=status.HTTP_200_OK)
