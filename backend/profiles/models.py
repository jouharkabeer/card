from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator

User = get_user_model()


class GalleryImage(models.Model):
    """Gallery images for user profiles."""
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to='gallery/', blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'
    
    def __str__(self):
        return f"Gallery image for {self.profile.username}"


class Profile(models.Model):
    STATUS_CHOICES = [
        ('payment_received', 'Payment Received'),
        ('printing', 'Printing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]
    
    TEMPLATE_CHOICES = [
        ('template1', 'Template 1 - Classic'),
        ('template2', 'Template 2 - Modern'),
        ('template3', 'Template 3 - Minimal'),
        ('template4', 'Template 4 - Elegant'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, default='')
    designation = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    instagram = models.URLField(blank=True, null=True, validators=[URLValidator()])
    linkedin = models.URLField(blank=True, null=True, validators=[URLValidator()])
    youtube = models.URLField(blank=True, null=True, validators=[URLValidator()])
    website = models.URLField(blank=True, null=True, validators=[URLValidator()])
    twitter = models.URLField(blank=True, null=True, validators=[URLValidator()])
    figma = models.URLField(blank=True, null=True, validators=[URLValidator()])
    others = models.JSONField(default=dict, blank=True)  # Format: {"label": "url"}
    about = models.TextField(blank=True, null=True)
    
    # New fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='payment_received')
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='template1')
    
    # Customization fields
    background_color = models.CharField(max_length=100, default='#E6E0F2', help_text='Page background color (hex code or gradient)')
    card_color = models.CharField(max_length=100, default='#FFFFFF', help_text='Card background color (hex code or gradient)')
    button_color = models.CharField(max_length=100, default='#1E3A8A', help_text='Button color (hex code or gradient)')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def username(self):
        return self.user.username

    def __str__(self):
        return f"{self.name} ({self.username})"

    class Meta:
        ordering = ['-created_at']

