from rest_framework import serializers
from .models import Submission, UserProfile, University, Course, UserSavedCourse, Feedback, FeedbackResponse, Notification, CustomUser

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_picture']

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'bio']
        read_only_fields = ['id']
    
    def get_profile_picture(self, obj):
        if hasattr(obj, 'profile') and obj.profile:
            # Check both profile_picture and image fields (for backward compatibility)
            if obj.profile.profile_picture:
                return obj.profile.profile_picture.url
            elif obj.profile.image:
                return obj.profile.image.url
        return None
    
    def get_bio(self, obj):
        # Always get or create the profile to ensure bio is present
        from .models import UserProfile
        profile, created = UserProfile.objects.get_or_create(user=obj)
        return profile.bio


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, min_length=8)
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm Password')
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, min_length=2, max_length=30)
    last_name = serializers.CharField(required=True, min_length=2, max_length=30)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
    
    def validate_username(self, value):
        """Validate username format and uniqueness"""
        import re
        if not value:
            raise serializers.ValidationError("Username is required.")
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if len(value) > 30:
            raise serializers.ValidationError("Username must not exceed 30 characters.")
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        import re
        if not value:
            raise serializers.ValidationError("Email is required.")
        # Basic email format validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Please enter a valid email address.")
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value.lower()
    
    def validate_first_name(self, value):
        """Validate first name format"""
        import re
        if not value:
            raise serializers.ValidationError("First name is required.")
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("First name must contain only letters.")
        if len(value) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters long.")
        return value.strip().capitalize()
    
    def validate_last_name(self, value):
        """Validate last name format"""
        import re
        if not value:
            raise serializers.ValidationError("Last name is required.")
        if not re.match(r'^[A-Za-z]+$', value):
            raise serializers.ValidationError("Last name must contain only letters.")
        if len(value) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters long.")
        return value.strip().capitalize()
    
    def validate_password(self, value):
        """Validate password strength"""
        import re
        if not value:
            raise serializers.ValidationError("Password is required.")
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>).")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role='student'  # Default role
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'role', 'created_at']


class CourseSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'duration', 'fees', 'level', 'university', 'university_name']

class UniversitySerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    website = serializers.CharField(max_length=200, required=False, allow_blank=True, allow_null=True)
    image = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = University
        fields = ['id', 'name', 'description', 'location', 'ranking', 'website', 'image', 'courses']
    
    def validate_website(self, value):
        """Allow empty strings, None, or any string for website"""
        if value in ('', None):
            return ''
        return value
    
    def validate_image(self, value):
        """Allow empty strings, None, or any string for image"""
        if value in ('', None):
            return ''
        return value

class UserSavedCourseSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = UserSavedCourse
        fields = ['id', 'course', 'saved_at', 'course_details']

class FeedbackResponseSerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin.username', read_only=True)
    
    class Meta:
        model = FeedbackResponse
        fields = ['id', 'feedback', 'admin', 'admin_username', 'message', 'created_at']
        extra_kwargs = {
            'admin': {'required': False},  # Will be set from the request user
            'feedback': {'required': False}  # Will be set from backend, not POST data
        }


class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    responses = FeedbackResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'username', 'user_email', 'subject', 'message', 'created_at', 'is_resolved', 'responses']
        extra_kwargs = {'user': {'required': False}}  # Will be set from the request user

# Notification serializer
class NotificationSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True, default=None)

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'recipient_username', 'sender', 'sender_username', 'message', 'created_at', 'is_read', 'type']