from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, Heat
from api.serializers.HeatDisplaySerializer import LaneSerializer
from drf_spectacular.utils import extend_schema, OpenApiExample
from django.db.models import Max
from django.db import transaction


@extend_schema(tags=['Heat'], request=LaneSerializer())
class LaneBatchView(APIView):
    @extend_schema(summary="Retrieves the heat assignments for each lane for a given event")
    def get(self, request, event_id):
        # Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get num_lanes
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.site.num_lanes
        except:
            return Response({'error': 'Not able to retrieve number of lanes'}, status=status.HTTP_404_NOT_FOUND)

        max_num_heat = event_instance.total_num_heats

        if max_num_heat:
            lanes_data = []
            for lane_num in range(1, num_lanes+1):
                # Retrieve all heats for the given event_id and lane_num
                heats = Heat.objects.filter(
                    event_id=event_id, lane_num=lane_num)
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
                            "heat_time": None
                        })

                # Serialize the heats using LaneSerializer
                serializer = LaneSerializer(heats_data, many=True)
                lanes_data.append({
                    "id": lane_num,
                    "lane_name": f"Lane {lane_num}",
                    "heats": serializer.data
                })
            return Response({
                'count': num_lanes,
                'results': lanes_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'count': 0,
                'results': []
            }, status=status.HTTP_200_OK)


@extend_schema(tags=['Heat'], request=LaneSerializer())
class LaneDetailView(APIView):
    @extend_schema(summary="Displays heats distribution on a specific lane for a given event")
    def get(self, request, event_id, lane_num):
        # Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get number of lanes on the event
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.site.num_lanes
        except:
            return Response({'error': 'Not able to retrieve number of lanes'}, status=status.HTTP_404_NOT_FOUND)

        # Get number of heats on the event
        max_num_heat = event_instance.total_num_heats

        if max_num_heat:
            if 1 <= lane_num <= num_lanes:
                # Retrieve all heats for the given event_id and lane_num
                heats = Heat.objects.filter(
                    event_id=event_id, lane_num=lane_num)
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
                            "heat_time": None
                        })

                # Serialize the heats using LaneSerializer
                serializer = LaneSerializer(heats_data, many=True)
                response_data = {
                    'count': len(heats_data),
                    'results': serializer.data
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'There is not a lane with that number'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'This event does not have heats yet'}, status=status.HTTP_200_OK)


@extend_schema(tags=['Heat'], request=LaneSerializer())
class UpdateHeatTimeView(APIView):

    @extend_schema(examples=[
        OpenApiExample(
            "Example Value",
            summary="Example of a PUT request",
            value=[
                {
                    "heat_id": 1,
                    "heat_time": "45.90"
                },
                {
                    "heat_id": 2,
                    "heat_time": "45.90"
                },
                {
                    "heat_id": 3,
                    "heat_time": "45.90"
                }
            ]
        )
    ],
        summary="Updates the recorded times for all heats listed")
    @transaction.atomic
    def put(self, request):
        for heat_record in request.data:
            try:
                heat_instance = Heat.objects.get(id=heat_record['heat_id'])
                event_instance = heat_instance.event
                serializer = LaneSerializer(instance=heat_instance, data=heat_record, context={
                                            'event': event_instance}, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
            except Heat.DoesNotExist:
                return Response({'error': 'Heat not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Heats updated successfully'}, status=status.HTTP_200_OK)
