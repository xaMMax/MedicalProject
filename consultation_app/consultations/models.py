from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.conf import settings
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractUser):
    is_doctor = models.BooleanField(default=False)
    is_user = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    groups = models.ManyToManyField(Group, related_name='customuser_set')
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set')

    objects = CustomUserManager()

    class Meta:
        db_table = 'CustomUser'

    def __str__(self):
        return self.username


class Consultation(models.Model):
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='doctor_consultations', on_delete=models.CASCADE)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='patient_consultations',
                                on_delete=models.CASCADE, default=1)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=timezone.now)
    notes = models.TextField()
    objects = BaseUserManager()

    def __str__(self):
        return f"Consultation with {self.patient} by Dr. {self.doctor} on {self.date} at {self.time}"


class Message(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(CustomUser, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    objects = BaseUserManager()

    def __str__(self):
        return f"Message from {self.sender} to {self.recipient}"