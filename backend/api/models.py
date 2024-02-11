from django.db import models
from django.contrib.auth.models import AbstractUser
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
