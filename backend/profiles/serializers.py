from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile, GalleryImage

User = get_user_model()


class GalleryImageSerializer(serializers.ModelSerializer):
    """Serializer for gallery images."""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryImage
        fields = ('id', 'image', 'image_url', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    profile_image_url = serializers.SerializerMethodField()
    gallery_urls = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            'username', 'profile_image', 'profile_image_url', 'name',
            'designation', 'email', 'phone', 'whatsapp', 'instagram',
            'linkedin', 'youtube', 'website', 'twitter', 'figma', 'others', 'about',
            'status', 'template', 'gallery_urls', 'background_color', 'card_color', 'button_color'
        )
        read_only_fields = ('username', 'status')  # Status is admin-only

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None
    
    def get_gallery_urls(self, obj):
        """Return gallery image URLs from related GalleryImage objects."""
        gallery_images = obj.gallery_images.all()[:3]  # Limit to 3 images
        request = self.context.get('request')
        urls = []
        for gallery_image in gallery_images:
            if gallery_image.image:
                if request:
                    urls.append(request.build_absolute_uri(gallery_image.image.url))
                else:
                    urls.append(gallery_image.image.url)
        return urls


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'profile_image', 'name', 'designation', 'email', 'phone',
            'whatsapp', 'instagram', 'linkedin', 'youtube', 'website', 'twitter', 'figma', 'others', 'about',
            'template', 'background_color', 'card_color', 'button_color'
        )

    def validate_name(self, value):
        """Validate that name is provided."""
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required")
        return value.strip()

    def validate_others(self, value):
        """Validate that others is a dictionary with string keys and values."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Others must be a dictionary")
        
        # Filter out empty keys or values
        cleaned_value = {}
        for key, val in value.items():
            if not isinstance(key, str) or not isinstance(val, str):
                raise serializers.ValidationError(
                    "Others dictionary must have string keys and values"
                )
            # Only include non-empty entries
            if key.strip() and val.strip():
                cleaned_value[key.strip()] = val.strip()
        
        return cleaned_value


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for admin user list with profile status."""
    status = serializers.SerializerMethodField()
    status_value = serializers.SerializerMethodField()
    profile_id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'is_staff', 'status', 'status_value', 'profile_id')
    
    def get_status(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.get_status_display()
        return 'No Profile'
    
    def get_status_value(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.status
        return None
    
    def get_profile_id(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.id
        return None
