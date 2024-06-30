from django.contrib import admin

from .models import MedicalRecord, Patient

# Register your models here.
admin.site.register(MedicalRecord)
admin.site.register(Patient)
