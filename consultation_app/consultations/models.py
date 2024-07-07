import datetime
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date, time
from django.conf import settings
from django.utils import timezone


class CustomUser(AbstractUser):
    is_doctor = models.BooleanField(default=False)
    is_user = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    groups = models.ManyToManyField(Group, related_name='customuser_set')
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set')

    def __str__(self):
        return self.username


class Consultation(models.Model):
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='doctor_consultations', on_delete=models.CASCADE)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='patient_consultations',
                                on_delete=models.CASCADE, default=1)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    notes = models.TextField()

    def __str__(self):
        return f"Consultation with {self.patient} by Dr. {self.doctor} on {self.date} at {self.time}"
