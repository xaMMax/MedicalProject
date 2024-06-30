from django.db import models


class Appointment(models.Model):
    patient = models.CharField(max_length=100)
    doctor = models.CharField(max_length=100)
    appointment_date = models.DateTimeField()
    notes = models.TextField()


class Message(models.Model):
    sender = models.CharField(max_length=100)
    recipient = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
