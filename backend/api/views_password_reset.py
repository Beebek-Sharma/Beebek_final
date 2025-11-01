import random
import string
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import PasswordResetCode

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def request_reset(request):
    """
    Request a password reset code via email
    """
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal if email exists or not for security
        return Response({'message': 'If the email exists, a reset code has been sent'}, status=status.HTTP_200_OK)
    
    # Generate a 6-digit code
    code = ''.join(random.choices(string.digits, k=6))
    
    # Delete any existing reset codes for this user
    PasswordResetCode.objects.filter(user=user).delete()
    
    # Create new reset code
    PasswordResetCode.objects.create(user=user, code=code)
    
    # Send email with reset code
    try:
        send_mail(
            'Password Reset Code',
            f'Your password reset code is: {code}\n\nThis code will expire in 15 minutes.',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
    except Exception as e:
        return Response({'error': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'message': 'Reset code sent to your email'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_code_reset(request):
    """
    Verify the reset code and reset the password
    """
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    
    if not all([email, code, new_password]):
        return Response({'error': 'Email, code, and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid email or code'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        reset_code = PasswordResetCode.objects.get(user=user, code=code)
        
        # Check if code has expired (15 minutes)
        if reset_code.is_expired():
            reset_code.delete()
            return Response({'error': 'Reset code has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user password
        user.password = make_password(new_password)
        user.save()
        
        # Delete the used reset code
        reset_code.delete()
        
        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        
    except PasswordResetCode.DoesNotExist:
        return Response({'error': 'Invalid email or code'}, status=status.HTTP_400_BAD_REQUEST)
