import datetime
from django.contrib.messages.storage.cookie import MessageSerializer
from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Consultation, CustomUser, Message
from .serializers import (RegisterSerializer, MyTokenObtainPairSerializer, ConsultationSerializer, UserSerializer,
                          CustomUserSerializer, MessageCreateSerializer, MessageDisplaySerializer)
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PasswordResetSerializer, SetPasswordSerializer
import logging
from rest_framework.exceptions import NotFound
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_session(request):
    return JsonResponse({'status': 'ok'}, status=200)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = permissions.AllowAny
    serializer_class = RegisterSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ConsultationListView(generics.ListAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Consultation.objects.all()
        elif user.is_doctor:
            return Consultation.objects.filter(doctor=user)
        else:
            return Consultation.objects.filter(patient=user)


class ConsultationCreateView(generics.CreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['post']

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class ConsultationCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            consultation = Consultation.objects.get(pk=pk, patient=request.user)
            doctor_email = consultation.doctor.email
            consultation.delete()

            # Відправити повідомлення лікарю
            send_mail('Консультація відмінена',
                      f'Користувач {request.user.username} відмінив консультацію на {consultation.date} о'
                      f' {consultation.time}.',
                      settings.EMAIL_HOST_USER, [doctor_email])

            return Response({'message': 'Консультацію відмінено'}, status=status.HTTP_200_OK)
        except Consultation.DoesNotExist:
            raise NotFound("Consultation not found or you don't have permission to cancel it.")


class UserListView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        print("Validated data:", serializer.validated_data)
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_superuser and not request.user.is_superuser:
            raise PermissionDenied("Only superusers can delete other superusers.")
        return super().destroy(request, *args, **kwargs)


class PasswordResetView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data['email']
            user = get_object_or_404(CustomUser, email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            message = render_to_string('password_reset_email.html', {
                'user': user,
                'reset_url': reset_url
            })
            send_mail(
                'Password Reset',
                message,
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            return Response({'message': 'Password reset link sent'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SetPasswordView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            serializer = SetPasswordSerializer(data=request.data)
            if serializer.is_valid():
                user.set_password(serializer.data['password'])
                user.save()
                return Response({'message': 'Password has been reset'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)


class StatisticsView(APIView):
    def get(self, request, *args, **kwargs):
        users_count = CustomUser.objects.count()
        consultations_count = Consultation.objects.count()
        consultations_today = Consultation.objects.filter(date=datetime.date.today()).count()

        data = {
            "users_count": users_count,
            "consultations_count": consultations_count,
            "consultations_today": consultations_today,
        }
        return Response(data, status=status.HTTP_200_OK)


class CreateUserView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user": RegisterSerializer(user, context=self.get_serializer_context()).data,
                "message": "User created successfully"
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorConsultationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_doctor:
            return Consultation.objects.filter(doctor=user)
        return Consultation.objects.none()


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class PatientListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(is_user=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DoctorConsultationListView(generics.ListCreateAPIView):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_doctor:
            return Consultation.objects.filter(doctor=user)
        return Consultation.objects.none()

    def perform_create(self, serializer):
        try:
            serializer.save(doctor=self.request.user)
        except Exception as e:
            print(e)  # Додаємо це для виведення деталей помилки
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Додаємо це для виведення помилок валідації
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConsultationListCreateView(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class MessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(recipient=user) | Q(sender=user))

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageCreateSerializer
        return MessageDisplaySerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageDisplaySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(recipient=self.request.user)


class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        logger.debug(f"Saving message with sender: {self.request.user}")
        serializer.save(sender=self.request.user)

    def create(self, request, *args, **kwargs):
        logger.debug(f"Received data for message creation: {request.data}")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        message = serializer.instance
        logger.debug(f"Created message: {message}")
        display_serializer = MessageDisplaySerializer(message)
        logger.debug(f"Response data: {display_serializer.data}")
        return Response(display_serializer.data)


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

