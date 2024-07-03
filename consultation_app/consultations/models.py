from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    is_doctor = models.BooleanField(default=False)
    is_user = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    groups = models.ManyToManyField(Group, related_name='customuser_set')
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set')

    def __str__(self):
        return self.username


class Consultation(models.Model):
    user = models.ForeignKey(CustomUser, related_name='consultations', on_delete=models.CASCADE)
    doctor = models.ForeignKey(CustomUser, related_name='patients', on_delete=models.CASCADE)
    date = models.DateTimeField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Consultation on {self.date} with Dr. {self.doctor.username}"
