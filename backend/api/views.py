from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import Submission, User, UserProfile, University, Course, UserSavedCourse, Feedback, FeedbackResponse
from .serializers import (
    SubmissionSerializer, UserSerializer, UserRegistrationSerializer,
    UniversitySerializer, CourseSerializer, UserSavedCourseSerializer,
    FeedbackSerializer, FeedbackResponseSerializer
)

@api_view(['GET', 'POST'])
def hello(request):
    return Response({"message": 'Hello, World in Django world!'})

@api_view(['GET', 'POST'])
def submissions(request):
    if request.method == 'POST':
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
    submissions = Submission.objects.all().order_by('-created_at')
    serializer = SubmissionSerializer(submissions, many=True)
    return Response(serializer.data)

# Authentication views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print(f"Register request data: {request.data}")
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    print(f"Registration errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"Login attempt: {username}")
    
    user = authenticate(username=username, password=password)
    if user:
        print(f"User authenticated: {user.username}")
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        print(f"User data: {user_data}")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        })
    print(f"Authentication failed for user: {username}")
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    print(f"Getting user profile for: {request.user.username}")
    serializer = UserSerializer(request.user)
    print(f"User profile data: {serializer.data}")
    return Response(serializer.data)

# University and Course views
@api_view(['GET', 'POST'])
def list_universities(request):
    import logging
    logger = logging.getLogger("universities_view")
    if request.method == 'GET':
        logger.info(f"GET universities: user={request.user}, is_authenticated={request.user.is_authenticated}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
        universities = University.objects.all()
        serializer = UniversitySerializer(universities, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        is_admin = request.user.is_authenticated and (
            (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or 
            request.user.is_superuser
        )
        logger.info(f"POST universities: user={request.user}, is_admin={is_admin}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
        if not is_admin:
            logger.warning(f"403 Forbidden: user={request.user}, is_admin={is_admin}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
            return Response({'error': 'Only admins can create universities'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UniversitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def university_detail(request, pk):
    try:
        university = University.objects.get(pk=pk)
    except University.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UniversitySerializer(university)
        return Response(serializer.data)
    
    # Check if user is admin or superuser for modifying operations
    is_admin = request.user.is_authenticated and (
        (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or 
        request.user.is_superuser
    )
    if not is_admin:
        return Response({'error': 'Only admins can modify universities'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'PUT':
        serializer = UniversitySerializer(university, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        university.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def list_courses(request):
    import logging
    logger = logging.getLogger("courses_view")
    if request.method == 'GET':
        logger.info(f"GET courses: user={request.user}, is_authenticated={request.user.is_authenticated}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
        query = request.query_params.get('query', '')
        university_id = request.query_params.get('university', None)
        level = request.query_params.get('level', None)
        courses = Course.objects.all()
        if query:
            courses = courses.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) |
                Q(university__name__icontains=query)
            )
        if university_id:
            courses = courses.filter(university__id=university_id)
        if level:
            courses = courses.filter(level=level)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        is_admin = request.user.is_authenticated and (
            (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or 
            request.user.is_superuser
        )
        logger.info(f"POST courses: user={request.user}, is_admin={is_admin}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
        if not is_admin:
            logger.warning(f"403 Forbidden: user={request.user}, is_admin={is_admin}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
            return Response({'error': 'Only admins can create courses'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
    # Check if user is admin or superuser for modifying operations
    is_admin = request.user.is_authenticated and (
        (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or 
        request.user.is_superuser
    )
    if not is_admin:
        return Response({'error': 'Only admins can modify courses'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# User saved courses
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_saved_courses(request):
    if request.method == 'GET':
        saved_courses = UserSavedCourse.objects.filter(user=request.user)
        serializer = UserSavedCourseSerializer(saved_courses, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        course_id = request.data.get('course_id')
        try:
            course = Course.objects.get(pk=course_id)
            saved_course, created = UserSavedCourse.objects.get_or_create(
                user=request.user,
                course=course
            )
            if created:
                return Response({'message': 'Course saved successfully'}, status=status.HTTP_201_CREATED)
            return Response({'message': 'Course already saved'}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE':
        course_id = request.data.get('course_id')
        try:
            saved_course = UserSavedCourse.objects.get(user=request.user, course_id=course_id)
            saved_course.delete()
            return Response({'message': 'Course removed from saved list'}, status=status.HTTP_200_OK)
        except UserSavedCourse.DoesNotExist:
            return Response({'error': 'Saved course not found'}, status=status.HTTP_404_NOT_FOUND)

# Admin view to list all users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    import logging
    logger = logging.getLogger("users_view")
    is_admin = (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or request.user.is_superuser
    logger.info(f"GET users: user={request.user}, is_authenticated={request.user.is_authenticated}, is_admin={is_admin}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
    if not is_admin:
        logger.warning(f"403 Forbidden: user={request.user}, is_admin={is_admin}, is_superuser={getattr(request.user, 'is_superuser', None)}, profile={getattr(request.user, 'profile', None)}")
        return Response({'error': 'Only admins can access user list'}, status=status.HTTP_403_FORBIDDEN)
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# Admin view to manage individual users
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    # Check if user is admin or superuser
    is_admin = (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or request.user.is_superuser
    if not is_admin:
        return Response({'error': 'Only admins can manage users'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        # Don't update password through this endpoint
        data = request.data.copy()
        if 'password' in data:
            del data['password']
        
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Update user profile if role is provided
            if 'role' in data:
                profile = user.profile
                profile.role = data['role']
                profile.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        # Prevent admin from deleting themselves
        if user == request.user:
            return Response({'error': 'You cannot delete your own account'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Feedback views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def feedback_list(request):
    if request.method == 'GET':
        try:
            # Check if user has a profile
            if hasattr(request.user, 'profile') and request.user.profile.role == 'admin':
                feedbacks = Feedback.objects.all().order_by('-created_at')
            # For students, return only their own feedback
            else:
                feedbacks = Feedback.objects.filter(user=request.user).order_by('-created_at')
                
            serializer = FeedbackSerializer(feedbacks, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Create new feedback
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def feedback_detail(request, pk):
    try:
        feedback = Feedback.objects.get(pk=pk)
    except Feedback.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions: admin can access all feedback, students only their own
    is_admin = hasattr(request.user, 'profile') and request.user.profile.role == 'admin'
    if not is_admin and feedback.user != request.user:
        return Response({'error': 'You do not have permission to access this feedback'}, 
                        status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        # Only allow the user who created the feedback to update it
        if feedback.user != request.user:
            return Response({'error': 'You can only update your own feedback'}, 
                           status=status.HTTP_403_FORBIDDEN)
            
        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        # Allow admin or the feedback creator to delete
        is_admin = (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or request.user.is_superuser
        if is_admin or feedback.user == request.user:
            feedback.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'You can only delete your own feedback'}, 
                       status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback_response_create(request, feedback_id):
    # Only admins can respond to feedback
    is_admin = (hasattr(request.user, 'profile') and request.user.profile.role == 'admin') or request.user.is_superuser
    if not is_admin:
        return Response({'error': 'Only admins can respond to feedback'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        feedback = Feedback.objects.get(pk=feedback_id)
    except Feedback.DoesNotExist:
        return Response({'error': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = FeedbackResponseSerializer(data=request.data)
    if serializer.is_valid():
        # Save the response with admin user and feedback
        response = serializer.save(admin=request.user, feedback=feedback)
        
        # Mark the feedback as resolved and save it
        feedback.is_resolved = True
        feedback.save()
        
        # Return the serialized response data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)