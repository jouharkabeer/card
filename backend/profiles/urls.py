from django.urls import path
from . import views

urlpatterns = [
    path('profile/<str:username>/', views.get_public_profile, name='public-profile'),
    path('my-profile/', views.MyProfileView.as_view(), name='my-profile'),
    path('admin/users/', views.get_all_users, name='admin-users'),
    path('admin/users/<int:profile_id>/status/', views.update_user_status, name='admin-update-status'),
]


