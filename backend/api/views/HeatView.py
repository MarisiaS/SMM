from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, Heat
from api.serializers.HeatDisplaySerializer import CompleteHeatSerializer, ResumeHeatSerializer
from drf_spectacular.utils import extend_schema
from django.db import transaction
from django.db.models import Max
from datetime import timedelta


@extend_schema(tags=['Heat'])
class HeatView(APIView):
    def get(self, request, event_id, heat_num):
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
            if 1<= heat_num <= max_num_heat:
                # Retrieve all heats for the given event_id and heat_num
                heats = Heat.objects.filter(event_id=event_id, num_heat=heat_num)
                lanes_data = []
                for lane_num in range(1, num_lanes + 1):
                    lane_data = heats.filter(lane_num=lane_num).first()
                    if lane_data is not None:
                        lanes_data.append(lane_data)
                    else:
                        lanes_data.append({
                            "id": None,
                            "lane_num": lane_num,
                            "athlete": None,
                            "seed_time": timedelta(days=500)
                    })
        
                # Serialize the heats using CompleteHeatSerializer
                serializer = CompleteHeatSerializer(lanes_data, many=True)
        
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'There is not a heat with that number'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'This event does not have heats yet'}, status=status.HTTP_200_OK)
        
@extend_schema(tags=['Heat'], request=ResumeHeatSerializer(many=True))
class LaneView(APIView):
    def get(self, request, event_id, lane_num):
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
            if 1<= lane_num <= num_lanes:
                # Retrieve all heats for the given event_id and heat_num
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
                    })
        
                # Serialize the heats using CompleteHeatSerializer
                serializer = ResumeHeatSerializer(heats_data, many=True)
        
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'There is not a lane with that number'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'This event does not have heats yet'}, status=status.HTTP_200_OK)

    @transaction.atomic
    def put(self, request, event_id, lane_num): 
        # Given all the athletes on a lane, update the heat_time and register the time on TimeRecord.
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
        
        if 1<= lane_num <= num_lanes: 
            result_data = request.data
            for heat_record in result_data:
                if heat_record['athlete'] is not None:
                    num_heat = heat_record['num_heat']
                    try:
                        heat_instance = Heat.objects.get(event=event_instance,num_heat=num_heat, lane_num=lane_num)
                        serializer = ResumeHeatSerializer(instance=heat_instance, data=heat_record, context={'event': event_instance}, partial=True)
                        if serializer.is_valid(raise_exception=True):
                            serializer.save()
                    except Heat.DoesNotExist:
                        return Response({'error': 'Heat not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'message': 'Heats updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'There is not a lane with that number'}, status=status.HTTP_404_NOT_FOUND)

