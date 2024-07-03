from django.contrib.auth.views import PasswordResetConfirmView
from django.urls import path
from .views import (RegisterView, MyTokenObtainPairView, ConsultationListView, UserListView, UserDetailView,
                    PasswordResetView, SetPasswordView, StatisticsView, CreateUserView)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('create-user/', CreateUserView.as_view(), name='create-user'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('consultations/', ConsultationListView.as_view(), name='consultation-list'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),  # Додаємо маршрут для статистики
]