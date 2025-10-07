from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer


def set_jwt_cookies(response, access_token, refresh_token):
    """
    Helper function to set JWT tokens in httpOnly cookies
    """
    # Access token cookie
    response.set_cookie(
        key='access_token',
        value=str(access_token),
        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        httponly=True,
        secure=settings.JWT_AUTH_SECURE,
        samesite=settings.JWT_AUTH_SAMESITE,
        domain=getattr(settings, 'JWT_AUTH_DOMAIN', None),
    )
    # Refresh token cookie
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
        httponly=True,
        secure=settings.JWT_AUTH_SECURE,
        samesite=settings.JWT_AUTH_SAMESITE,
        domain=getattr(settings, 'JWT_AUTH_DOMAIN', None),
    )


def delete_jwt_cookies(response):
    """
    Helper function to delete JWT cookies with the same parameters as when they were set
    """
    # Delete with the same path, domain, and samesite settings
    # This ensures the browser targets the correct cookies
    response.delete_cookie(
        'access_token', 
        path='/', 
        domain=getattr(settings, 'JWT_AUTH_DOMAIN', None),
        samesite=settings.JWT_AUTH_SAMESITE
    )
    response.delete_cookie(
        'refresh_token', 
        path='/', 
        domain=getattr(settings, 'JWT_AUTH_DOMAIN', None),
        samesite=settings.JWT_AUTH_SAMESITE
    )
    # Also clear Django session cookie for full logout
    response.delete_cookie(
        'sessionid',
        path='/',
        domain=getattr(settings, 'JWT_AUTH_DOMAIN', None)
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user and return JWT tokens in httpOnly cookies
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        # Prepare response
        response = Response({
            'user': UserSerializer(user).data,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
        
        # Set JWT cookies
        set_jwt_cookies(response, access, refresh)
        
        return response
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login user and return JWT tokens in httpOnly cookies
    """
    import logging
    logger = logging.getLogger('django')
    
    # Log all request details for debugging
    logger.debug(f"[login_view] Request headers: {request.headers}")
    logger.debug(f"[login_view] Request data: {request.data}")
    logger.debug(f"[login_view] Request COOKIES: {request.COOKIES}")
    
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    logger.debug(f"[login_view] Login attempt: username={username}, email={email}")
    
    # Handle missing credentials
    if not password:
        logger.warning("[login_view] No password provided")
        return Response(
            {'error': 'Password is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    if not (username or email):
        logger.warning("[login_view] No username or email provided")
        return Response(
            {'error': 'Username or email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Allow login with either username or email
    if email and not username:
        user_obj = CustomUser.objects.filter(email=email).first()
        logger.debug(f"[login_view] Found user by email: {user_obj}")
        if not user_obj:
            logger.warning(f"[login_view] No user found for email: {email}")
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        username = user_obj.username
        
    # Authenticate user
    user = authenticate(username=username, password=password)
    logger.debug(f"[login_view] authenticate() returned: {user}")
    
    if user is not None:
        logger.info(f"[login_view] User authenticated: {user.username}")
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        # Check if this is a token fallback request
        include_token = request.data.get('include_token', False)
        logger.debug(f"[login_view] Include token requested: {include_token}")
        
        response_data = {
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        }
        
        # If client requested a token (for browsers with cookie issues like Brave)
        if include_token:
            response_data['token'] = str(access)
            logger.debug("[login_view] Including token in response for fallback auth")
        
        response = Response(response_data, status=status.HTTP_200_OK)
        
        # Always set cookies for standard browsers
        set_jwt_cookies(response, access, refresh)
        
        # Log the response and cookies for debugging
        logger.debug(f"[login_view] Setting cookies: access_token (expires in {settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']}), refresh_token (expires in {settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']})")
        logger.debug(f"[login_view] Cookie settings: httponly={settings.JWT_AUTH_HTTPONLY}, secure={settings.JWT_AUTH_SECURE}, samesite={settings.JWT_AUTH_SAMESITE}, domain={settings.JWT_AUTH_DOMAIN}")
        
        return response
        
    logger.warning(f"[login_view] Invalid credentials for username={username}")
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to logout, even unauthenticated users
def logout_view(request):
    """
    Logout user by blacklisting refresh token and clearing cookies
    """
    import logging
    logger = logging.getLogger('django')
    
    logger.info(f"[logout_view] Processing logout request, COOKIES: {request.COOKIES}")
    
    try:
        # Get refresh token from cookie
        refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
        logger.debug(f"[logout_view] Found refresh token: {bool(refresh_token)}")
        
        if refresh_token:
            try:
                # Blacklist the token (if blacklist is enabled)
                token = RefreshToken(refresh_token)
                token.blacklist()
                logger.debug("[logout_view] Successfully blacklisted token")
            except Exception as e:
                logger.error(f"[logout_view] Error blacklisting token: {e}")
                # Continue with logout even if blacklisting fails
        
        # Check for token in Authorization header as well
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                token_str = auth_header.split(' ')[1]
                token = RefreshToken(token_str)
                token.blacklist()
                logger.debug("[logout_view] Successfully blacklisted token from Authorization header")
            except Exception as e:
                logger.error(f"[logout_view] Error blacklisting token from header: {e}")
        
        response = Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
        # Clear JWT cookies
        delete_jwt_cookies(response)
        
        logger.info("[logout_view] Logout successful, cookies cleared")
        return response
    except Exception as e:
        logger.error(f"[logout_view] Error during logout: {e}")
        response = Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
        # Clear cookies even if an error occurs
        delete_jwt_cookies(response)
        
        return response
    except Exception as e:
        response = Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
        # Clear cookies even if token blacklisting fails
        delete_jwt_cookies(response)
        
        return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get current authenticated user
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
# Explicitly disable throttling for this view to ensure token refresh always works
def refresh_token_view(request):
    """
    Refresh JWT access token using refresh token from cookie
    """
    import logging
    logger = logging.getLogger('django')
    refresh_token = request.COOKIES.get('refresh_token')
    logger.debug(f"[refresh_token_view] Cookie '{settings.JWT_AUTH_REFRESH_COOKIE}' value: {refresh_token}")
    if not refresh_token:
        logger.warning("[refresh_token_view] No refresh token cookie found.")
        return Response(
            {'error': 'Refresh token not found'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        # Create new refresh token instance
        token = RefreshToken(refresh_token)
        logger.debug(f"[refresh_token_view] RefreshToken object created successfully.")
        # Get new access token
        access = token.access_token
        logger.debug(f"[refresh_token_view] New access token generated.")
        # Prepare response with token in body for fallback authentication
        response = Response({
            'message': 'Token refreshed successfully',
            'token': str(access)  # Include token in response for fallback auth
        }, status=status.HTTP_200_OK)
        # Set new access token cookie
        response.set_cookie(
            key='access_token',
            value=str(access),
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            httponly=True,
            secure=settings.JWT_AUTH_SECURE,
            samesite=settings.JWT_AUTH_SAMESITE,
            domain=getattr(settings, 'JWT_AUTH_DOMAIN', None),
        )
        # If ROTATE_REFRESH_TOKENS is enabled, set new refresh token
        if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', False):
            response.set_cookie(
                key='refresh_token',
                value=str(token),
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                secure=settings.JWT_AUTH_SECURE,
                samesite=settings.JWT_AUTH_SAMESITE,
                domain=getattr(settings, 'JWT_AUTH_DOMAIN', None),
            )
        logger.debug(f"[refresh_token_view] Cookies set for access and refresh tokens.")
        return response
    except TokenError as e:
        logger.warning(f"[refresh_token_view] Invalid or expired refresh token: {e}")
        return Response(
            {'error': 'Invalid or expired refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    """
    Get CSRF token for cookie-based authentication
    """
    return Response({
        'csrfToken': get_token(request)
    })
