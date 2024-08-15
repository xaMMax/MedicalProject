from django.views.generic import TemplateView
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework_api_key.permissions import HasAPIKey

from .models import Consultation, Message
from .permissions import IsUser, IsMessageOwner
from .serializers import CustomUserSerializer, ConsultationSerializer, MessageSerializer, RegisterSerializer, \
    ChangePasswordSerializer, LoginSerializer

CustomUser = get_user_model()


class ConsultationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsMessageOwner]
    queryset = Message.objects.all()

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(recipient=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class RegisterView(generics.CreateAPIView):
    permission_classes = []
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": RegisterSerializer(user, context=self.get_serializer_context()).data,
                "message": "User registered successfully.",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = []
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_data = serializer.save()
        return Response(token_data, status=status.HTTP_200_OK)


class CustomUserViewSet(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get', 'put'], url_path='profile')
    def profile(self, request):
        user = request.user
        if request.method == 'PUT':
            serializer = self.get_serializer(user, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            serializer = self.get_serializer(user)
            return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='doctors')
    def list_doctors(self, request):
        doctors = self.queryset.filter(is_doctor=True)
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsUser])
    def doctors(self, request):
        doctors = CustomUser.objects.filter(is_doctor=True)
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)


class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    serializer_class = ChangePasswordSerializer
    model = CustomUser

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            # Set new password
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Test_pageView(TemplateView):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    template_name = "test_page.html"


class MyAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]

    def get(self, request):
        return Response({"message": "Hello, World!"})
