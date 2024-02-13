from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
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


class Session(models.Model):
    days_of_week = ArrayField(models.BooleanField(default=False), size=7)
    time = models.TimeField()
    coach = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='coach_group')
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, related_name='school_group')
    
    @property
    def name(self):
        abbreviations = ["M", "T", "W", "Th", "F", "Sa", "Su"]
        selected_days = [abbreviations[i] for i in range(7) if self.days_of_week[i]==True]
        hour_part = f"{self.time.hour:02d}"
        days_part = "".join(selected_days)
        return f"{days_part}{hour_part}"