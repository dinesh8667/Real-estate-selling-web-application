from django.db import models
from django.contrib.auth.models import User # We'll use default Django user for now

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_seller = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {'Seller' if self.is_seller else 'Buyer'}"

class FeatureTag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Property(models.Model):
    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Active', 'Active'),
        ('Sold', 'Sold'),
    )

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1) # e.g., 2.5 baths
    area_sqft = models.IntegerField()
    
    # Location data
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    
    # Relationships
    tags = models.ManyToManyField(FeatureTag, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Draft')
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.city}"

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    # For now, this saves to a local 'media/property_images/' folder
    image = models.ImageField(upload_to='property_images/')
    is_main = models.BooleanField(default=False) # To highlight the cover image

    def __str__(self):
        return f"Image for {self.property.title}"