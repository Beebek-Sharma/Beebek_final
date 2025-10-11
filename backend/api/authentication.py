from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
import logging

logger = logging.getLogger('django.auth')

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        """
        Attempt JWT auth via httpOnly cookie, but NEVER block other auth backends
        (e.g., SessionAuthentication) if the JWT is missing/invalid. This is
        critical for social logins (Google) which rely on the Django session.
        """
        # Try to get JWT from cookie first
        access_token = request.COOKIES.get(getattr(settings, 'JWT_AUTH_COOKIE', 'access_token'))
        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                return self.get_user(validated_token), validated_token
            except Exception as e:
                # Do not raise; fall through so SessionAuthentication can succeed
                logger.warning(f"[CookieJWTAuthentication] Invalid JWT cookie, falling back to other auth backends: {e}")
                # continue to header attempt below

        # Next, try Authorization header, but never raise on failure
        try:
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None
            try:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token
            except Exception as e:
                logger.warning(f"[CookieJWTAuthentication] Invalid JWT in Authorization header, ignoring: {e}")
                return None
        except Exception as e:
            logger.warning(f"[CookieJWTAuthentication] Header processing error, ignoring: {e}")
            return None
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