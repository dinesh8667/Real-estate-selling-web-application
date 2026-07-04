from django.contrib import admin
# REMOVED FeatureTag, ADDED PropertyType
from .models import Property, PropertyImage, UserProfile, PropertyType

# This allows you to upload images directly from the main Property page in the admin
class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]
    # Added property_type to the display columns
    list_display = ('title', 'price', 'property_type', 'city', 'status', 'seller')
    
    # Added property_type to the right-side filter sidebar
    list_filter = ('status', 'property_type', 'city')
    
    # (Removed filter_horizontal since 'tags' is gone and it's not needed for ForeignKeys)

admin.site.register(Property, PropertyAdmin)
admin.site.register(PropertyType) # Register the new model so you can add types!
admin.site.register(UserProfile)