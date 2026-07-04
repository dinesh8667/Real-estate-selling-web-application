from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, PropertyTypeViewSet, CurrentUserProfileView, SavedPropertyViewSet, MessageViewSet

router = DefaultRouter()
# THE FIX: Added basename='properties' right here!
router.register(r'properties', PropertyViewSet, basename='properties')
router.register(r'property-types', PropertyTypeViewSet)
router.register(r'saved-properties', SavedPropertyViewSet, basename='saved-properties')
router.register(r'messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/profile/', CurrentUserProfileView.as_view(), name='user-profile'), 
]