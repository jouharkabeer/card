from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
import json
from .models import Profile, GalleryImage
from .serializers import ProfileSerializer, ProfileUpdateSerializer, UserListSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_profile(request, username):
    """Get public profile by username."""
    try:
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class MyProfileView(generics.RetrieveUpdateAPIView):
    """Get and update authenticated user's profile."""
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileUpdateSerializer

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def get(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        
        # Parse JSON string fields from FormData
        data = request.data.copy()
        
        # Handle 'others' field
        if 'others' in data:
            if isinstance(data['others'], str):
                try:
                    data['others'] = json.loads(data['others'])
                except json.JSONDecodeError:
                    data['others'] = {}  # Default to empty dict if parsing fails
            elif not isinstance(data['others'], dict):
                data['others'] = {}
        
        # Handle gallery images - remove old ones and add new ones
        # Gallery images are sent as separate files with keys like 'gallery_0', 'gallery_1', etc.
        gallery_files = []
        
        # Get gallery files from request.FILES (not request.data)
        for key in request.FILES.keys():
            if key.startswith('gallery_'):
                try:
                    index = int(key.replace('gallery_', ''))
                    file_obj = request.FILES[key]
                    
                    # Handle case where Django might return a list
                    if isinstance(file_obj, list):
                        file_obj = file_obj[0] if file_obj else None
                    
                    # Ensure it's a single file object
                    if file_obj and hasattr(file_obj, 'read'):  # It's a file-like object
                        gallery_files.append((index, file_obj))
                except (ValueError, AttributeError, IndexError):
                    pass
        
        # Validate gallery count (max 3)
        if len(gallery_files) > 3:
            return Response(
                {'gallery': ['Maximum 3 gallery images allowed']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update profile fields (remove gallery keys from data if they exist)
        for key in list(data.keys()):
            if key.startswith('gallery_'):
                data.pop(key)
        
        # Update profile fields
        serializer = self.get_serializer(profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Handle gallery images: delete old ones and add new ones
        if gallery_files:
            # Delete existing gallery images
            profile.gallery_images.all().delete()
            
            # Add new gallery images (sorted by index)
            for index, image_file in sorted(gallery_files, key=lambda x: x[0]):
                if image_file and hasattr(image_file, 'read'):  # Ensure it's a valid file
                    GalleryImage.objects.create(profile=profile, image=image_file)
        
        # Return full profile data
        full_serializer = ProfileSerializer(profile, context={'request': request})
        return Response(full_serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users(request):
    """Get all users with their profile status (admin only)."""
    users = User.objects.all().select_related('profile')
    serializer = UserListSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_user_status(request, profile_id):
    """Update user profile status (admin only)."""
    try:
        profile = Profile.objects.get(id=profile_id)
        new_status = request.data.get('status')
        
        if new_status not in dict(Profile.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile.status = new_status
        profile.save()
        
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )

