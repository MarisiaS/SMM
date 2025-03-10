from api.models import Group
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django.db.models import Func, Value, F, IntegerField
from django.utils import timezone


"""
This function is used to filter a queryset by group.
When the queryset comes from the `Athlete` model, the 
argument `for_athlete_model` is not needed.
When the queryset comes from a model that contains
`Athlete` as a foreign key, the argument `for_athlete_model` should 
be set to `False`.
The age of an athlete is calculate at the date provided.
"""
def filter_by_group(group_id=None, queryset=None, date=timezone.now().date(), from_athlete_model=True):
    
    if queryset is None:
        raise ValidationError({'error': "A queryset must be provided"}, code=status.HTTP_400_BAD_REQUEST)
    
    if group_id is None:
        return queryset

    # Get the group instance with id group_id
    try:
        group_instance = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        raise ValidationError({'error': "Group does not exist"}, code=status.HTTP_400_BAD_REQUEST)

    # Distinguishes between the `Athlete` model and other models.
    if from_athlete_model:
        athlete_field = ""
    else:
        athlete_field = "athlete__"

    # Create an age field on `Athlete`.
    queryset = queryset.annotate(
        age=Func(
            Value("year"),
            Func(Value(date), F(
                f"{athlete_field}date_of_birth"), function="age"),
            function="date_part",
            output_field=IntegerField()
        )
    )

    # Filter by the gender specified in the group.
    gender = group_instance.gender
    if gender != 'MX':
        queryset = queryset.filter(**{f"{athlete_field}gender": gender})

    # Filter by age range of the group.
    min_age = group_instance.min_age
    max_age = group_instance.max_age
    if max_age is not None:
        queryset = queryset.filter(age__lte=max_age)
    if min_age is not None:
        queryset = queryset.filter(age__gte=min_age)

    return queryset