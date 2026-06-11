from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth JWT
    path('api/auth/token/',         TokenObtainPairView.as_view(),  name='token_obtain'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),

    # Annonces
    path('api/annonces/', include('annonces.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)