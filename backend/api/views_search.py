from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import University, Course

@api_view(['GET'])
def search(request):
    """
    Search for universities and courses
    """
    query = request.GET.get('q', '')
    if not query:
        return Response({"error": "Please provide a search query"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Search for universities
    universities = University.objects.filter(name__icontains=query)[:5]
    
    # Search for courses
    courses = Course.objects.filter(name__icontains=query)[:5]
    
    # Prepare response
    result = {
        'universities': [
            {
                'id': university.id, 
                'name': university.name,
                'location': university.location
            } 
            for university in universities
        ],
        'courses': [
            {
                'id': course.id, 
                'name': course.name,
                'level': course.level,  # Using level instead of code which doesn't exist
                'university': {
                    'id': course.university.id,
                    'name': course.university.name
                } if course.university else None
            } 
            for course in courses
        ]
    }
    
    return Response(result)