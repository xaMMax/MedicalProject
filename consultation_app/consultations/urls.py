from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, ConsultationListView, UserListView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/consultations/', ConsultationListView.as_view(), name='consultation_list'),
    path('api/users/', UserListView.as_view(), name='user_list'),  # Новий маршрут для списку користувачів
]