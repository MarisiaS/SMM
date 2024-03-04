from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework import status
from api.models import Athlete, Group
from api.serializers.AthleteSerializer import AthleteSerializer
from django.db.models import F, Func, IntegerField, Value
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
import logging

logger = logging.getLogger('django')


@extend_schema(tags=['Athlete'])
class AthleteViewSet(viewsets.ModelViewSet):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete', 'patch']
    
    def get_queryset(self):
        queryset = Athlete.objects.all()
        group_id = self.request.query_params.get('group_id')
        if group_id is not None:
            queryset = queryset.annotate(
                age=Func(
                Value("year"),
                Func(Value(timezone.now().date()), F("date_of_birth"), function="age"),
                function="date_part",
                output_field=IntegerField()))
            try:
                group_instance = Group.objects.get(id=group_id)
            except:
                raise ValidationError({'error': "Group does not exist"}, code=status.HTTP_400_BAD_REQUEST)
            gender = group_instance.gender
            print(gender)
            if gender!='MX':
                queryset = queryset.filter(gender=gender)
            min_age = group_instance.min_age
            max_age = group_instance.max_age
            print(min_age,max_age)
            if max_age is not None:
                queryset = queryset.filter(age__lte=max_age)
            if min_age is not None:
                queryset = queryset.filter(age__gte=min_age)
        return queryset
    
    @extend_schema(parameters =[OpenApiParameter(name="group_id", type=int),])
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)