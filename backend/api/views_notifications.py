from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feedback_unread(request):
    """
    Get unread feedback notifications
    """
    # For demo, we'll just return a simple response
    return Response({
        "count": 0,
        "results": []
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback_mark_read(request, pk):
    """
    Mark a feedback notification as read
    """
    # For demo, we'll just return a simple response
    return Response({"status": "marked as read"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback_mark_all_read(request):
    """
    Mark all feedback notifications as read
    """
    # For demo, we'll just return a simple response
    return Response({"status": "all marked as read"})