from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, Heat, Group, Athlete
from api.serializers.GenerateHeatSerializer import GenerateHeatSerializer
from api.serializers.HeatDisplaySerializer import HeatSerializer
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema
from django.db import transaction
from api.CustomFilter import filter_by_group


@extend_schema(tags=['Heat'])
class HeatBatchView(APIView):

    @extend_schema(summary="Retrieves the lane assignments for each heat for a given event")
    def get(self, request, event_id):
        # Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get num_lanes
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.num_lanes
        except:
            return Response({'error': 'Number of lanes not found for the swim meet.'}, status=status.HTTP_404_NOT_FOUND)

        max_num_heat = event_instance.total_num_heats

        if max_num_heat:
            heats_data = []
            for heat_num in range(1, max_num_heat+1):
                # Retrieve all heats for the given event_id and heat_num
                heats = Heat.objects.filter(
                    event_id=event_id, num_heat=heat_num)
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
                            "seed_time": None,
                            "heat_time": None
                        })
                serializer = HeatSerializer(lanes_data, many=True)
                heats_data.append({
                    "id": heat_num,
                    "heat_name": f"Heat {heat_num}",
                    "lanes": serializer.data
                })
            return Response({
                "count": max_num_heat,
                "results": heats_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "count": 0,
                "results": []
            }, status=status.HTTP_200_OK)

    @extend_schema(request=GenerateHeatSerializer, methods=['POST'], summary="Given an event and a list of participants with their seed times, generates the heats")
    def post(self, request, event_id):
        # Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # The event should not have heats
        if Heat.objects.filter(event=event_instance).exists():
            return Response({'error': 'Event already has heats'}, status=status.HTTP_400_BAD_REQUEST)

        # Get num_lanes
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.num_lanes

        except:
            return Response({'error': 'Number of lanes not found for the swim meet.'}, status=status.HTTP_404_NOT_FOUND)

        # Get group_id
        try:
            group_instance = event_instance.group
        except:
            return Response({'error': 'Not able to retrieve group'}, status=status.HTTP_404_NOT_FOUND)

        serializer = GenerateHeatSerializer(data=request.data, context={
                                            'num_lanes': num_lanes, 'event': event_instance})
        if serializer.is_valid(raise_exception=True):
            athletes_data = request.data.get('athletes', [])
            request_athlete_ids = {athlete['id'] for athlete in athletes_data}

            # Validate enrollment
            enrolled_athletes = Athlete.objects.filter(
                athlete_swim_meets__swim_meet=swim_meet_instance.id)
            enrolled_athlete_ids = set(
                enrolled_athletes.values_list('id', flat=True))
            if not request_athlete_ids.issubset(enrolled_athlete_ids):
                return Response({'error': 'One or more athletes are not enrolled in the swim meet.'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate group
            group_athletes = filter_by_group(
                group_id=group_instance.id, queryset=enrolled_athletes, date=swim_meet_instance.date, from_athlete_model=True)
            group_athlete_ids = set(
                group_athletes.values_list('id', flat=True))
            if not request_athlete_ids.issubset(group_athlete_ids):
                return Response({'error': 'One or more athletes are not part of the specified group for the event.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
        return Response({'success': 'Heats generated'}, status=status.HTTP_200_OK)

    @extend_schema(summary="Deletes all the heats for a given event")
    @transaction.atomic
    def delete(self, request, event_id):
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            Heat.objects.filter(event=event_instance).delete()
            event_instance.total_num_heats = 0
            event_instance.save()
        except Exception as e:
            transaction.set_rollback(True)
            return Response({'error': f'Failed to delete heats: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'success': 'Associated heats deleted'}, status=status.HTTP_200_OK)


@extend_schema(tags=['Heat'])
class HeatDetailView(APIView):
    @extend_schema(summary="Displays lanes distribution on a specific heat for a given event")
    def get(self, request, event_id, heat_num):
        # Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get number of lanes on the event
        try:
            swim_meet_instance = event_instance.swim_meet
            num_lanes = swim_meet_instance.num_lanes
        except:
            return Response({'error': 'Number of lanes not found for the swim meet.'}, status=status.HTTP_404_NOT_FOUND)

        # Get number of heats on the event
        max_num_heat = event_instance.total_num_heats
        if max_num_heat:
            if 1 <= heat_num <= max_num_heat:
                # Retrieve all heats for the given event_id and heat_num
                heats = Heat.objects.filter(
                    event_id=event_id, num_heat=heat_num)
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
                            "seed_time": None,
                            "heat_time": None
                        })

                # Serialize the lanes_data using HeatSerializer
                serializer = HeatSerializer(lanes_data, many=True)
                response_data = {
                    'count': len(lanes_data),
                    'results': serializer.data
                }

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'There is not a heat with that number'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'This event does not have heats yet'}, status=status.HTTP_200_OK)
