from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_auth(request):
    """
    Simple endpoint to verify if a user's authentication is still valid.
    Returns user details if authenticated, used by frontend to verify token validity.
    """
    return Response({
        'isAuthenticated': True,
        'user': UserSerializer(request.user).data,
        'message': 'Authentication verified'
    }, status=status.HTTP_200_OK)