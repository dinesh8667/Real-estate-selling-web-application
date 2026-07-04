from rest_framework import viewsets, permissions, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Property, PropertyType, SavedProperty, Message
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import PropertySerializer, PropertyTypeSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, UserProfileDetailSerializer, SavedPropertySerializer, MessageSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    # THE FIX: I accidentally deleted this line in the last step!
    serializer_class = PropertySerializer 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

    def get_queryset(self):
        queryset = Property.objects.all().order_by('-created_at')
        my_listings = self.request.query_params.get('my_listings', None)
        
        if my_listings == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(seller=self.request.user)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    def perform_update(self, serializer):
        # Ensure the person trying to edit the property is the original seller
        if self.get_object().seller != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only edit your own properties.")
        
        serializer.save()

class PropertyTypeViewSet(viewsets.ReadOnlyModelViewSet):
    # Cleaned this up: It only needs these three lines!
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # THE FIX: Allowed anyone to register, even without a token
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        profile = request.user.profile 
        serializer = UserProfileDetailSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request):
        profile = request.user.profile
        serializer = UserProfileDetailSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
            
        return Response(serializer.errors, status=400)
    
class SavedPropertyViewSet(viewsets.ModelViewSet):
    serializer_class = SavedPropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # 1. When React asks for data, ONLY return properties saved by this exact logged-in buyer
        return SavedProperty.objects.filter(buyer=self.request.user).order_by('-saved_at')

    def create(self, request, *args, **kwargs):
        # 2. Custom Toggle Logic for the React "Save" button
        property_id = request.data.get('property')
        
        if not property_id:
            return Response({"error": "Property ID is required"}, status=400)

        # Check if the buyer already saved this property
        existing_save = SavedProperty.objects.filter(buyer=request.user, property_id=property_id).first()

        if existing_save:
            # If it's already saved, hitting this endpoint deletes it (Unsave)
            existing_save.delete()
            return Response({"message": "Removed from wishlist", "is_saved": False})
        else:
            # If it's not saved, create a new record (Save)
            SavedProperty.objects.create(buyer=request.user, property_id=property_id)
            return Response({"message": "Added to wishlist", "is_saved": True})
        
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Grab messages where the user is EITHER the sender OR the receiver
        # The Q object lets us use the OR (|) operator in Django queries
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')

    def perform_create(self, serializer):
        # Automatically set the sender to the logged-in user!
        serializer.save(sender=self.request.user)