from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Core Account Type (Already here!)
    is_seller = models.BooleanField(default=False)
    
    # Shared Fields (For both Buyers and Sellers)
    user_name = models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    
    # Seller-Only Fields (Set to blank/null so Buyers don't have to fill them out)
    bio = models.TextField(blank=True, null=True)
    agency_name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        # Shows the custom name if they have one, otherwise defaults to email
        display_name = self.user_name if self.user_name else self.user.email
        return f"{display_name} - {'Seller' if self.is_seller else 'Buyer'}"

class PropertyType(models.Model):
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
    property_type = models.ForeignKey(PropertyType, on_delete=models.SET_NULL, null=True, related_name='properties')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.IntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    area_sqft = models.IntegerField()
    
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Draft')
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.city}"

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.property.title}"
    
class SavedProperty(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_properties')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # CRITICAL: This prevents a user from saving the same property multiple times!
        unique_together = ('buyer', 'property') 

    def __str__(self):
        return f"{self.buyer.email} saved {self.property.title}"
    
class Message(models.Model):
    # The person sending the message (Could be Buyer OR Seller)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    
    # The person receiving the message
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    
    # The property they are talking about
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='messages')
    
    # The actual message text
    content = models.TextField()
    
    # To track when it was sent, and if it has been read yet!
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.sender.email} to {self.receiver.email} about {self.property.title}"