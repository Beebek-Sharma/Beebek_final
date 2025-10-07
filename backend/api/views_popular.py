from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import University, Course

@api_view(['GET'])
def popular_items(request):
    """
    Get popular universities and courses
    """
    # Get popular universities (for demo, just get the first 5)
    popular_universities = University.objects.all()[:5]
    
    # Get popular courses (for demo, just get the first 5)
    popular_courses = Course.objects.all()[:5]
    
    # Prepare response
    result = {
        'universities': [
            {
                'id': university.id, 
                'name': university.name,
                'location': university.location,
                'image': university.image if university.image else None
            } 
            for university in popular_universities
        ],
        'courses': [
            {
                'id': course.id, 
                'name': course.name,
                'university': {
                    'id': course.university.id,
                    'name': course.university.name
                } if course.university else None
            } 
            for course in popular_courses
        ]
    }
    
    return Response(result)