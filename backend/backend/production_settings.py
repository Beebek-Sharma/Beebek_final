"""
Production settings for Django project.
Import this file in settings.py for production environments.
"""

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Replace with your actual domain(s)
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

CSRF_TRUSTED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]

# Cookie security settings
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = False  # Must be False for frontend to read CSRF token
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_DOMAIN = 'yourdomain.com'  # No leading dot if not including subdomains

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_DOMAIN = 'yourdomain.com'

# JWT Cookie settings
JWT_AUTH_SECURE = True  # For HTTPS only
JWT_AUTH_SAMESITE = 'Lax'  # Lax allows cookies to be sent with top-level navigation
JWT_AUTH_DOMAIN = 'yourdomain.com'  # Use '.yourdomain.com' to include subdomains

# Security middleware settings
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = True