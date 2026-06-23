from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, FeatureTagViewSet

# The DefaultRouter automatically generates all the URL endpoints for our ViewSets
router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'tags', FeatureTagViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]