from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.functions import Coalesce
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(_("first name"), max_length=150, blank=True, db_collation="case_insensitive")
    last_name = models.CharField(_("last name"), max_length=150, blank=True, db_collation="case_insensitive")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name']
    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Site(models.Model):
    class Len_unit(models.TextChoices):
        YARDS = "yd"
        METERS = "m"

    name = models.CharField(max_length=255, unique=True, db_collation='case_insensitive')
    num_lanes = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    pool_len = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    len_unit = models.CharField(max_length=20, choices=Len_unit.choices, default=Len_unit.YARDS)


class School(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True, db_collation='case_insensitive')
    open_hour = models.TimeField(null=True, blank=True)
    close_hour = models.TimeField(null=True, blank=True)


class Group(models.Model):
    class Gender(models.TextChoices):
        FEMALE = "F", _("Girl")
        MALE = "M", _("Boy")
        MIXED = "MX", _("Mixed")

    gender = models.CharField(max_length=20, choices=Gender.choices, default=Gender.MIXED)
    min_age = models.PositiveSmallIntegerField(blank=True, null=True)
    max_age = models.PositiveSmallIntegerField(blank=True, null=True)

    @property
    def name(self):
        gender_display = self.get_gender_display()
        if gender_display != "Mixed":
            gender_display += "s"
        age_range = ""
        if self.min_age is not None and self.max_age is not None and self.min_age == self.max_age:
            age_range = f"{self.min_age}"
        elif self.min_age is not None and self.max_age is not None:
            age_range = f"{self.min_age}to{self.max_age}"
        elif self.min_age is not None:
            age_range = f"{self.min_age}&Above"
        elif self.max_age is not None:
            age_range = f"{self.max_age}&Under"
        return f"{gender_display}{age_range}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                models.ExpressionWrapper(Coalesce('min_age', models.Value(-1)), output_field=models.IntegerField()),
                models.ExpressionWrapper(Coalesce('max_age', models.Value(-1)), output_field=models.IntegerField()),
                models.F('gender'),
                name='unique_group'
            )
        ]

class EventType(models.Model):
    class Stroke(models.TextChoices):
        FREESTYLE = "FR", _("Freestyle")
        BREASTSTROKE = "BR", _("Breaststroke")
        BACKSTROKE = "BK", _("Backstroke")
        BUTTERFLY = "FLY", _("Butterfly")
        MEDLEY = "M", _("Medley")

    class Type(models.TextChoices):
        INDIVIDUAL = "INDIVIDUAL", _("Individual")
        RELAY = "RELAY", _("Relay")
        
    stroke = models.CharField(max_length=20, choices=Stroke.choices, blank=False, null=False)
    distance = models.PositiveSmallIntegerField(blank=False, null=False)
    type = models.CharField(max_length=20, choices=Type.choices, blank=False, null=False, default=Type.INDIVIDUAL)

    @property
    def name(self):
        if self.type == "RELAY":
            return f"4x{self.distance} {self.stroke} {self.get_type_display()}"
        elif self.type == "INDIVIDUAL" and self.stroke == "M":
            return f"{self.distance} I.M"
        return f"{self.distance} {self.stroke}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['stroke', 'distance', 'type'], name='unique_event_type')
        ]


class Session(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    days_of_week = ArrayField(models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(1)] ), size=7)
    time = models.TimeField()
    coach = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='coach_group')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='school_group')

    
      
class SwimMeet(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    date = models.DateField(null=False, blank=False)
    time = models.TimeField(null=True, blank=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='swim_meet_site')
    school = models.ManyToManyField(School, related_name="swim_meet_schools")
    
class Athlete(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", _("Active")
        INACTIVE = "INACTIVE", _("Inactive")
    
    class Gender(models.TextChoices):
        FEMALE = "F", _("Girl")
        MALE = "M", _("Boy")
    
    first_name = models.CharField (max_length=150, blank=False, db_collation="case_insensitive")
    last_name = models.CharField(max_length=150, blank=False, db_collation="case_insensitive")    
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, choices=Gender.choices)
    status = models.CharField(max_length=20, choices=Status.choices)
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, related_name='atlethe_session_group')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='atlethe_school_group')
    email = models.EmailField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    
class TimeRecord(models.Model):
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, related_name='time_record_athlete_group')
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='time_record_event_type_group')
    swim_meet = models.ForeignKey(SwimMeet, on_delete=models.SET_NULL, blank=True, null=True, related_name='time_record_swim_meet_group')
    time = models.CharField(max_length=15, help_text='Time in minutes:seconds.milliseconds format')
    date = models.DateField(null=True, blank=True)

    
class MeetEvent(models.Model):
    swim_meet = models.ForeignKey(SwimMeet, on_delete=models.CASCADE, related_name='event_meet')
    group = models.ForeignKey(Group, on_delete=models.PROTECT, related_name='event_group')
    event_type = models.ForeignKey(EventType, on_delete=models.PROTECT, related_name='event_type')
    num_event = models.PositiveSmallIntegerField()

    @property
    def name(self):
        return f"#{self.num_event} {self.group.name} {self.event_type.name}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['swim_meet', 'num_event'], name='unique_num_event_swim_meet'),
            models.UniqueConstraint(fields=['swim_meet', 'event_type', 'group'], name='unique_group_event_type_swim_meet')
        ]
        
class Heat(models.Model):
    event = models.ForeignKey(MeetEvent, on_delete=models.CASCADE, related_name='heat_event')
    athlete = models.ForeignKey(Athlete, on_delete=models.SET_NULL, blank=True, null=True, related_name='heat_athlete')
    lane_num = models.PositiveSmallIntegerField()
    seed_time = models.CharField(max_length=15, help_text='Time in minutes:seconds.milliseconds format')
    heat_time = models.CharField(max_length=15, help_text='Time in minutes:seconds.milliseconds format')
    num_heat = models.PositiveSmallIntegerField()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['event', 'lane_num', 'num_heat'], name='unique_event_lane_heat'),
        ]
    
    
