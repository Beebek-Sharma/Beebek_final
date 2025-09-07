from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Submission, UserProfile, University, Course, UserSavedCourse, Feedback, FeedbackResponse

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    role = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'role']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_role(self, obj):
        try:
            return obj.userprofile.role
        except:
            return 'student'  # Default role
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        print(f"User representation: {representation}")
        # Make sure profile is included
        if not representation.get('profile') and hasattr(instance, 'userprofile'):
            representation['profile'] = UserProfileSerializer(instance.userprofile).data
            print(f"Added profile: {representation['profile']}")
        return representation

class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=False)
    role = serializers.CharField(write_only=True, required=False, default='student')
    profile = serializers.DictField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role', 'profile']
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        # For admin-created users, we might not have password_confirm
        if 'password_confirm' in data and data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError("Passwords do not match!")
        
        # Check if profile data is provided (for admin creating users)
        if 'profile' in data and 'role' in data['profile']:
            # Use the role from profile
            data['role'] = data['profile']['role']
        
        return data
    
    def create(self, validated_data):
        # Remove profile dict if it exists
        if 'profile' in validated_data:
            validated_data.pop('profile')
        
        # Extract role and fields for User model
        role = validated_data.pop('role', 'student')
        
        # Create user without using User.objects.create directly
        # because we need to handle password hashing
        user = User.objects.create_user(**validated_data)
        
        # Create user profile with the role
        UserProfile.objects.create(user=user, role=role)
        
        # Print confirmation for debugging
        print(f"Created user {user.username} with role {role}")
        
        return user

class CourseSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'duration', 'fees', 'level', 'university', 'university_name']

class UniversitySerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    
    class Meta:
        model = University
        fields = ['id', 'name', 'description', 'location', 'ranking', 'website', 'image', 'courses']

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
        extra_kwargs = {'admin': {'required': False}}  # Will be set from the request user

class FeedbackSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    responses = FeedbackResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'username', 'subject', 'message', 'created_at', 'is_resolved', 'responses']
        extra_kwargs = {'user': {'required': False}}  # Will be set from the request user