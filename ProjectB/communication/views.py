from rest_framework import serializers, viewsets
from .models import Appointment, Message
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import get_medical_records


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class MedicalRecordsView(APIView):
    def get(self, request, patient_id):
        medical_records = get_medical_records(patient_id)
        if medical_records:
            return Response(medical_records, status=status.HTTP_200_OK)
        return Response({"error": "Unable to fetch medical records"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)