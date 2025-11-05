from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'username', 'email', 'phone', 'status', 'template', 'created_at')
    list_filter = ('status', 'template', 'created_at')
    search_fields = ('name', 'user__username', 'email')
    readonly_fields = ('created_at', 'updated_at', 'username')
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'username', 'name', 'designation', 'email', 'phone', 'whatsapp', 'about')
        }),
        ('Social Links', {
            'fields': ('instagram', 'linkedin', 'youtube', 'website', 'others')
        }),
        ('Media', {
            'fields': ('profile_image', 'gallery')
        }),
        ('Settings', {
            'fields': ('status', 'template')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def username(self, obj):
        return obj.user.username
    username.short_description = 'Username'


# Customize User admin to show profile status
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class CustomUserAdmin(BaseUserAdmin):
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        return super().get_inline_instances(request, obj)
    
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_status')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'profile__status')
    
    def get_status(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.get_status_display()
        return 'No Profile'
    get_status.short_description = 'Status'


# Unregister the default User admin and register our custom one
# Only unregister if it's already registered (to avoid errors)
if admin.site.is_registered(User):
    admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


