from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import SwimMeet, School
from api.serializers.MeetSchoolSerializer import MeetSchoolListSerializer, SchoolsListSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Swim Meet - School'])
class MeetSchoolListView(APIView):
    def get(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MeetSchoolListSerializer(swim_meet)
        return Response(serializer.data)

@extend_schema(tags=['Swim Meet - School'], request=SchoolsListSerializer)    
class SchoolsToMeetView(APIView):
    def post(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'Swim Meet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SchoolsListSerializer(data=request.data)
        if serializer.is_valid():
            school_ids = serializer.validated_data['school_ids']
            schools_to_add = School.objects.filter(id__in=school_ids)
            
            # Add schools to the swim meet
            swim_meet.school.add(*schools_to_add)

            return Response({'success': 'Schools added to the swim meet'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, meet_id):
        try:
            swim_meet = SwimMeet.objects.get(id=meet_id)
        except SwimMeet.DoesNotExist:
            return Response({'error': 'SwimMeet not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SchoolsListSerializer(data=request.data)
        if serializer.is_valid():
            school_ids = serializer.validated_data['school_ids']

            # Remove schools from the swim meet
            swim_meet.school.remove(*school_ids)

            return Response({'success': 'Schools removed from the swim meet'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)