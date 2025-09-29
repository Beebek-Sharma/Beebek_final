from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    hello, submissions, register_user, login_user, get_user_profile, update_user_profile,
    list_universities, university_detail, list_courses, course_detail,
    user_saved_courses, list_users, user_detail,
    feedback_list, feedback_detail, feedback_response_create, featured_feedback
)
from .views_search import search
from .views_popular import popular_items
from .views_notifications import feedback_unread, feedback_mark_read, feedback_mark_all_read

urlpatterns = [
    path('hello/', hello, name='hello'),
    path('submissions/', submissions, name='submissions'),
    
    # Authentication URLs
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', get_user_profile, name='user_profile'),
    path('auth/update-profile/', update_user_profile, name='update_profile'),
    
    # Admin URLs
    path('users/', list_users, name='list_users'),
    path('users/<int:pk>/', user_detail, name='user_detail'),
    
    # University and Course URLs
    path('universities/', list_universities, name='universities'),
    path('universities/<int:pk>/', university_detail, name='university_detail'),
    path('courses/', list_courses, name='courses'),
    path('courses/<int:pk>/', course_detail, name='course_detail'),
    
    # User saved courses
    path('user/saved-courses/', user_saved_courses, name='user_saved_courses'),
    
    # Feedback system
    path('feedback/', feedback_list, name='feedback_list'),
    path('feedback/<int:pk>/', feedback_detail, name='feedback_detail'),
    path('feedback/<int:feedback_id>/respond/', feedback_response_create, name='feedback_response_create'),
    
    # Notifications
    path('notifications/feedback/', feedback_unread, name='feedback_unread'),
    path('notifications/feedback/<int:pk>/mark-read/', feedback_mark_read, name='feedback_mark_read'),
    path('notifications/feedback/mark-all-read/', feedback_mark_all_read, name='feedback_mark_all_read'),
    
    # Search
    path('search/', search, name='search'),
    
    # Popular items
    path('popular/', popular_items, name='popular_items'),
    
    # Featured feedback for homepage
    path('featured-feedback/', featured_feedback, name='featured_feedback'),
]
