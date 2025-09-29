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
        
    def to_representation(self, instance):
        """
        Handle edge cases where the profile might not have all fields
        """
        try:
            representation = super().to_representation(instance)
            # Ensure role is always included
            if 'role' not in representation or not representation['role']:
                representation['role'] = 'student'
            return representation
        except Exception as e:
            print(f"Error in UserProfileSerializer.to_representation: {str(e)}")
            # Return minimal data to prevent API failures
            return {'role': 'student'}

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    role = serializers.SerializerMethodField(read_only=True)
    display_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile', 'role', 'display_name']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_display_name(self, obj):
        # Use first_name and last_name if available
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        # Use email if available (without the @clerk-users.local part)
        elif obj.email:
            if '@clerk-users.local' in obj.email:
                # For auto-generated emails, create a cleaner display
                user_id = obj.email.split('@')[0]
                if user_id.startswith('user_'):
                    return f"User {user_id[-8:]}"
                return user_id
            # Return the email username part
            return obj.email.split('@')[0]
        # Fall back to username if nothing else is available
        else:
            # If username looks like a Clerk ID (long string)
            if len(obj.username) > 15:
                if obj.username.startswith('user_'):
                    # For Clerk user IDs, show a shorter, more readable version
                    return f"User {obj.username.split('_')[-1][:8]}..."
                return f"User {obj.username[:8]}..."
            return obj.username
    
    def get_role(self, obj):
        # Define known admin users by username
        admin_usernames = ['bibehsharma777', 'user_32XoWcGcnIhBc9l8k3AlXmRqEck', 'admin']
        
        # Check if user is a superuser or has a known admin username
        if obj.is_superuser or obj.username in admin_usernames:
            return 'admin'
        
        try:
            # Try to get role from the user profile
            # Use hasattr first to avoid unnecessary DB queries
            if hasattr(obj, 'profile'):
                return obj.profile.role or 'student'
            
            # If profile not loaded in the queryset, try direct database lookup
            try:
                profile = UserProfile.objects.get(user=obj)
                return profile.role
            except UserProfile.DoesNotExist:
                # Default to student role if no profile exists
                # We should never reach this point if update_clerk_users command was run
                return 'student'
        except Exception as e:
            print(f"Error getting role for user {obj.username}: {str(e)}")
            return 'student'  # Default role for safety
    
    def to_representation(self, instance):
        try:
            representation = super().to_representation(instance)
            
            # Log complete user data for debugging
            print(f"User data - id: {instance.id}, username: {instance.username}")
            print(f"User names - first_name: '{instance.first_name}', last_name: '{instance.last_name}'")
            
            # Get or create profile directly from the database - most reliable approach
            try:
                profile = UserProfile.objects.get(user=instance)
            except UserProfile.DoesNotExist:
                # Create a profile if it doesn't exist
                role = 'admin' if instance.is_superuser else 'student'
                profile = UserProfile.objects.create(user=instance, role=role)
                
            # Always include profile data from our retrieved/created profile
            representation['profile'] = UserProfileSerializer(profile).data
            
            # Always include role
            representation['role'] = profile.role
            if instance.is_superuser and profile.role != 'admin':
                # Ensure superusers always have admin role
                representation['role'] = 'admin'
            
            # Always include display_name
            representation['display_name'] = self.get_display_name(instance)
            
            # Detailed log for debugging
            print(f"Final representation: {representation}")
            return representation
        except Exception as e:
            import traceback
            print(f"Error in to_representation for user {instance.username}: {str(e)}")
            print(traceback.format_exc())
            # Return a basic representation to avoid breaking the API
            return {
                'id': instance.id,
                'username': instance.username,
                'display_name': instance.username,
                'role': 'admin' if instance.is_superuser else 'student'
            }

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