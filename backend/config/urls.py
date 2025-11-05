"""
URL configuration for config project.

API Endpoints:
- GET    /api/profile/<username>/     - Public profile view
- GET    /api/my-profile/             - Get authenticated user's profile
- PUT    /api/my-profile/              - Update authenticated user's profile
- POST   /api/register/               - User registration
- POST   /api/login/                  - User login
- POST   /api/token/refresh/          - Refresh JWT token
- GET    /api/admin/users/             - Get all users (admin only)
- PUT    /api/admin/users/<id>/status/ - Update user status (admin only)

Admin:
- GET    /admin/                      - Django admin interface
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('profiles.urls')),
    path('api/', include('users.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files
# Note: In production, configure nginx/apache to serve media files directly
# This is only for development or if not using a web server
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
else:
    # In production, media files should be served by nginx/apache
    # But we'll still add the URL pattern for Django to handle routing
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

