from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import MeetEvent, Heat
from api.serializers.EventResultSerializer import EventResultSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from api.CustomFilter import filter_by_group



@extend_schema(tags=['Results'])
class EventResultView(APIView):
    @extend_schema(parameters =[OpenApiParameter(name="group_id", type=int)],summary="Displays the results of an event")
    def get(self, request, event_id):
        #Get event instance
        try:
            event_instance = MeetEvent.objects.get(id=event_id)
        except MeetEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        #Return all heats record with event = even_instance order by heat_time
        data = self.get_queryset(event_instance)
        serializer = EventResultSerializer(data, many=True)
        return Response(serializer.data)

    def get_queryset(self, event_instance):
        queryset = Heat.objects.filter(event=event_instance)
        group_id = self.request.query_params.get('group_id')
        if group_id is not None:
            queryset = filter_by_group(group_id, queryset, False)

        results = list(queryset.order_by('heat_time', 'athlete__last_name', 'athlete__first_name'))
        
        if results:
            current_rank = 1
            previous_time = -1
            for i, result in enumerate(results):
                if result.heat_time in ["NS", "DQ", None]:
                    break 
                elif result.heat_time == previous_time:
                    result.rank = current_rank
                else:
                    current_rank = i + 1
                    result.rank = current_rank
                previous_time = result.heat_time
        return results