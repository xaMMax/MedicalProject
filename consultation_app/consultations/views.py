from django.views.generic import TemplateView
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework_api_key.permissions import HasAPIKey

from .models import Consultation, Message
from .serializers import CustomUserSerializer, ConsultationSerializer, MessageSerializer, RegisterSerializer, \
    ChangePasswordSerializer, UserProfileSerializer

CustomUser = get_user_model()


class CustomUserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class ConsultationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

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


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated | HasAPIKey]
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


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