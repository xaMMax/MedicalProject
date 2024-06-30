from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Patient(models.Model):
    name = models.CharField(max_length=100, blank=False)
    surname = models.CharField(max_length=100, blank=False, null=False)
    date_of_birth = models.DateField()
    email = models.EmailField(blank=True, null=True)
    phone = PhoneNumberField(null=False, blank=False, unique=True)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'{self.name, self.surname, self.email, self.phone}'


class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    diagnosis = models.TextField()
    treatment = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_finished = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.patient, self.diagnosis, self.treatment, self.date_created}'
