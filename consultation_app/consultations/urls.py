from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomUserViewSet, ConsultationViewSet, MessageViewSet, RegisterView, UserProfileView, \
    ChangePasswordView, Test_pageView

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'messages', MessageViewSet)

schema_view = get_schema_view(openapi.Info(title="Consultations API", default_version='v1',
                                           description="Test description",
                                           terms_of_service="https://www.google.com/policies/terms/",
                                           contact=openapi.Contact(email="contact@snippets.local"),
                                           license=openapi.License(name="BSD License"),
                                           ),
                              public=True,
                              permission_classes=[permissions.AllowAny,],
                              )

urlpatterns = [
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('test', Test_pageView.as_view(), name='test'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
