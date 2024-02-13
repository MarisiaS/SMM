from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
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


<<<<<<< HEAD
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


class session(models.Model):
=======
class Session(models.Model):
>>>>>>> 9defb72 (Changes to days_of_week validation)
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