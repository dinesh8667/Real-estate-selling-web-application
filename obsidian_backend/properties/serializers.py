from rest_framework import serializers
from .models import Property, FeatureTag, PropertyImage, UserProfile
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # BULLETPROOF FIX: Grab 'role' directly from the raw incoming data
        # so Django's validator can't accidentally strip it out.
        raw_role = self.initial_data.get('role', 'buyer')
        
        # Clean it up just in case (removes spaces, makes lowercase)
        clean_role = str(raw_role).lower().strip()
        
        # Create the base user
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Now create the profile with absolute certainty
        UserProfile.objects.create(user=user, is_seller=(clean_role == 'seller'))
        
        return user

class FeatureTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureTag
        fields = ['id', 'name']

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'is_main']

# class PropertySerializer(serializers.ModelSerializer):
#     # This nests the tags and images directly inside the property JSON
#     # so React gets all the data in one single API call!
#     tags = FeatureTagSerializer(many=True, read_only=True)
#     images = PropertyImageSerializer(many=True, read_only=True)
#     seller_name = serializers.CharField(source='seller.get_full_name', read_only=True)

#     class Meta:
#         model = Property
#         fields = [
#             'id', 'title', 'description', 'price', 'bedrooms', 
#             'bathrooms', 'area_sqft', 'address', 'city', 
#             'status', 'views', 'created_at', 'seller_name', 
#             'tags', 'images'
#         ]

class PropertySerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField()

    # NEW: Tell Django not to look for this in the React request
    seller = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model = Property
        fields = '__all__'

    def get_main_image(self, obj):
        request = self.context.get('request')
        
        # FIX: Use the custom related_name 'images' instead of 'propertyimage_set'
        first_image = obj.images.first() 
        
        if first_image and first_image.image:
            return request.build_absolute_uri(first_image.image.url)
        return None

    # NEW: Override the creation process to handle physical files
    def create(self, validated_data):
        # 1. Grab the request object so we can access the hidden files
        request = self.context.get('request')
        
        # 2. Extract the array of files named 'images' (we will set this name in React)
        images_data = request.FILES.getlist('images')

        # 3. Create the actual property first using the standard text data
        property_instance = super().create(validated_data)

        # 4. Loop through the uploaded files and link them to the new property
        for index, image_data in enumerate(images_data):
            PropertyImage.objects.create(
                property=property_instance,
                image=image_data,
                is_main=(index == 0) # Automatically makes the first photo the cover!
            )

        return property_instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Run the standard login check
        data = super().validate(attrs)
        
        # NEW: Inject our custom profile data into the JSON response!
        try:
            data['is_seller'] = self.user.profile.is_seller
        except UserProfile.DoesNotExist:
            data['is_seller'] = False
            
        return data