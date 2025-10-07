from rest_framework_simplejwt.authentication import JWTAuthentication as BaseJWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings
from rest_framework import authentication


import logging

logger = logging.getLogger('django.auth')

class JWTCookieAuthentication(BaseJWTAuthentication):
    """
    Custom JWT authentication class that reads tokens from cookies
    instead of Authorization header
    """
    
    def authenticate(self, request):
        # Log headers to debug CORS issues
        logger.debug(f"Auth request headers: {request.headers}")
        logger.debug(f"Auth request COOKIES: {request.COOKIES}")
        
        # First try to get token from cookie
        raw_token = request.COOKIES.get('access_token')
        
        if raw_token is None:
            logger.debug("No access_token cookie found, falling back to header auth")
            # If not in cookie, fall back to header authentication
            return super().authenticate(request)
            
        try:
            # Validate and decode the token
            validated_token = self.get_validated_token(raw_token)
            
            # Get the user from the validated token
            user = self.get_user(validated_token)
            logger.debug(f"Successfully authenticated user {user.username} from cookie")
            
            return user, validated_token
        except InvalidToken as e:
            # Log the token validation error
            logger.error(f"Token validation error: {e}")
            return None
        except Exception as e:
            # Catch other unexpected errors
            logger.error(f"Unexpected error in JWTCookieAuthentication: {e}")
            return None