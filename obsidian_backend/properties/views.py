from rest_framework import viewsets, permissions, generics
from rest_framework.permissions import AllowAny
from .models import Property, FeatureTag
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import PropertySerializer, FeatureTagSerializer, RegisterSerializer, CustomTokenObtainPairSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions for Properties.
    """
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer

    # NEW: Anyone can view (GET), but only logged-in users can create/edit (POST/PUT)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # NEW: Intercept the creation and attach the user from the token!
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class FeatureTagViewSet(viewsets.ModelViewSet):
    queryset = FeatureTag.objects.all()
    serializer_class = FeatureTagSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # CRITICAL: Allows guests to register
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer