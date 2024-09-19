from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, Heat
from api.serializers.HeatDisplaySerializer import LaneSerializer
from drf_spectacular.utils import extend_schema, OpenApiExample
from django.db.models import Max

@extend_schema(tags=['Heat'], request=LaneSerializer())
class LaneBatchManagementView(APIView):
    @extend_schema(summary="Retrieves the heat assignments for each lane for a given event")
    def get(self, request, event_id):
        #Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        #Get num_lanes
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.site.num_lanes
        except:
            return Response({'error': 'Not able to retrieve number of lanes'}, status=status.HTTP_404_NOT_FOUND)
        
        max_num_heat = Heat.objects.filter(event_id=event_id).aggregate(max_num_heat=Max('num_heat'))['max_num_heat']

        if max_num_heat is not None:
            lanes_data = []
            for lane_num in range (1,num_lanes+1):
                # Retrieve all heats for the given event_id and lane_num
                heats = Heat.objects.filter(event_id=event_id, lane_num=lane_num)
                heats_data = []
                for heat in range(1, max_num_heat + 1):
                    heat_data = heats.filter(num_heat=heat).first()
                    if heat_data is not None:
                        heats_data.append(heat_data)
                    else:
                        heats_data.append({
                            "id": None,
                            "num_heat": heat,
                            "athlete": None,
                            "seed_time": None
                    })
        
                # Serialize the heats using LaneSerializer
                serializer = LaneSerializer(heats_data, many=True)
                lanes_data.append({
                "lane_name": f"Lane {lane_num}",
                "heats": serializer.data
            })
            return Response({
            'count': num_lanes,
            'results': lanes_data
        }, status=status.HTTP_200_OK)
        else:
            return Response({
            'count': num_lanes,
            'results': []
        }, status=status.HTTP_200_OK)