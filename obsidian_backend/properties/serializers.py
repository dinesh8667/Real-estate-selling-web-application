from rest_framework import serializers
from .models import Property, PropertyImage, UserProfile, PropertyType, SavedProperty, Message
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    # These fields aren't on the default User model, so we tell the serializer to expect them
    role = serializers.CharField(write_only=True, required=False)
    user_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    bio = serializers.CharField(write_only=True, required=False, allow_blank=True)
    agency_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        # Notice we are using 'email' as the main identifier here instead of username
        fields = ('email', 'password', 'role', 'user_name', 'phone_number', 'bio', 'agency_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # 1. Pop out the custom Profile data so it doesn't crash the base User creation
        raw_role = self.initial_data.get('role', 'buyer')
        clean_role = str(raw_role).lower().strip()
        
        user_name = self.initial_data.get('user_name', '')
        phone_number = self.initial_data.get('phone_number', '')
        bio = self.initial_data.get('bio', '')
        agency_name = self.initial_data.get('agency_name', '')

        # 2. Create the base Django User (We use their email as their official username behind the scenes)
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # 3. Create the awesome custom Profile with all the new data!
        UserProfile.objects.create(
            user=user, 
            is_seller=(clean_role == 'seller'),
            user_name=user_name,
            phone_number=phone_number,
            bio=bio,
            agency_name=agency_name
        )
        
        return user

class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = ['id', 'name']

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'is_main']

class UserProfileDetailSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = UserProfile
        # fields = ['email', 'is_seller', 'user_name', 'phone_number', 'bio', 'agency_name']
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField()
    gallery_images = serializers.SerializerMethodField()
    property_type_name = serializers.ReadOnlyField(source='property_type.name')
    seller = serializers.ReadOnlyField(source='seller.username')
    seller_details = UserProfileDetailSerializer(source='seller.profile', read_only=True)

    class Meta:
        model = Property
        fields = '__all__'

    def get_main_image(self, obj):
        request = self.context.get('request')
        first_image = obj.images.filter(is_main=True).first() 
        
        if not first_image:
            first_image = obj.images.first()
            
        if first_image and first_image.image:
            return request.build_absolute_uri(first_image.image.url)
        return None

    def get_gallery_images(self, obj):
        request = self.context.get('request')
        other_images = obj.images.filter(is_main=False)
        
        image_urls = []
        for img in other_images:
            if img.image:
                image_urls.append(request.build_absolute_uri(img.image.url))
                
        return image_urls

    def create(self, validated_data):
        request = self.context.get('request')
        images_data = request.FILES.getlist('images')
        main_image_index = int(request.data.get('main_image_index', 0))

        property_instance = super().create(validated_data)

        for index, image_data in enumerate(images_data):
            PropertyImage.objects.create(
                property=property_instance,
                image=image_data,
                is_main=(index == main_image_index) 
            )

        return property_instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        try:
            data['is_seller'] = self.user.profile.is_seller
            data['user_name'] = self.user.profile.user_name
            data['user_id'] = self.user.id # Optional: Send name back on login!
        except UserProfile.DoesNotExist:
            data['is_seller'] = False
        return data
    
class UserProfileDetailSerializer(serializers.ModelSerializer):
    # Reach into the linked User table to grab the email!
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = UserProfile
        fields = ['email', 'is_seller', 'user_name', 'phone_number', 'bio', 'agency_name']

class SavedPropertySerializer(serializers.ModelSerializer):
    # This nests the entire property payload inside the saved property record!
    property_details = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = SavedProperty
        fields = ['id', 'buyer', 'property', 'saved_at', 'property_details']
        read_only_fields = ['buyer']

class MessageSerializer(serializers.ModelSerializer):
    # Send back the actual names/emails so the frontend UI looks good
    sender_name = serializers.ReadOnlyField(source='sender.profile.user_name')
    sender_email = serializers.ReadOnlyField(source='sender.email')
    
    receiver_name = serializers.ReadOnlyField(source='receiver.profile.user_name')
    property_title = serializers.ReadOnlyField(source='property.title')

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'property', 'content', 
            'timestamp', 'is_read', 'sender_name', 'sender_email', 
            'receiver_name', 'property_title'
        ]
        # React shouldn't send the 'sender' ID, Django will grab it securely from the token
        read_only_fields = ['sender', 'is_read', 'timestamp']