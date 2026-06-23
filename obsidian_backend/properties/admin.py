from django.contrib import admin
from .models import Property, FeatureTag, PropertyImage, UserProfile

# This allows you to upload images directly from the main Property page in the admin
class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]
    list_display = ('title', 'price', 'city', 'status', 'seller')
    list_filter = ('status', 'city')
    filter_horizontal = ('tags',)

admin.site.register(Property, PropertyAdmin)
admin.site.register(FeatureTag)
admin.site.register(UserProfile)