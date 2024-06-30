from django.urls import path
from .views import MedicalRecordsView

urlpatterns = [
    path('medical-records/<int:patient_id>/', MedicalRecordsView.as_view(), name='medical-records'),
]