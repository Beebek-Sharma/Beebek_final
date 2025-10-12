from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    hello, submissions, get_user_profile, update_user_profile,
    promote_to_admin, list_universities, university_detail, list_courses, course_detail,
    user_saved_courses, list_users, user_detail,
    feedback_list, feedback_detail, feedback_response_create, featured_feedback,
    notifications_list, notifications_create, notifications_mark_read, notifications_clear_all, me
)
from .views_auth import (
    register_view, login_view, logout_view, current_user_view, 
    refresh_token_view, get_csrf_token, upload_profile_picture,
    change_password, edit_username, update_name
)
from .views_search import search
from .views_popular import popular_items
from .views_notifications import feedback_unread, feedback_mark_read, feedback_mark_all_read
from .views_verify import verify_auth
from .views_chat import chat_message, chat_history, chat_clear, chat_summary
from .views_password_reset import request_reset, verify_code_reset

urlpatterns = [
    path('hello/', hello, name='hello'),
    path('submissions/', submissions, name='submissions'),
    
    # JWT Authentication URLs (custom with cookies)
    path('auth/register/', register_view, name='register'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/user/', current_user_view, name='current_user'),
    path('auth/refresh/', refresh_token_view, name='token_refresh'),
    path('auth/csrf/', get_csrf_token, name='csrf_token'),
    path('auth/verify/', verify_auth, name='verify_auth'),
    path('auth/upload-profile-picture/', upload_profile_picture, name='upload_profile_picture'),
    path('auth/change-password/', change_password, name='change_password'),
    path('auth/edit-username/', edit_username, name='edit_username'),
    path('auth/update-name/', update_name, name='update_name'),
    
    # Social auth (django-allauth)
    path('auth/social/', include('dj_rest_auth.urls')),
    path('auth/social/registration/', include('dj_rest_auth.registration.urls')),
    
    # Legacy endpoints (keep for backward compatibility)
    path('auth/me/', get_user_profile, name='user_profile'),
    path('auth/update-profile/', update_user_profile, name='update_profile'),
    path('auth/promote-to-admin/', promote_to_admin, name='promote_to_admin'),
    path('me/', me, name='me'),
    
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
    path('feedbacks/popular/', featured_feedback, name='feedbacks_popular'),
    

    # Notification system
    path('notifications/', notifications_list, name='notifications_list'),
    path('notifications/create/', notifications_create, name='notifications_create'),
    path('notifications/<int:pk>/mark-read/', notifications_mark_read, name='notifications_mark_read'),
    path('notifications/clear-all/', notifications_clear_all, name='notifications_clear_all'),
    
    # Search
    path('search/', search, name='search'),
    
    # Popular items
    path('popular/', popular_items, name='popular_items'),
    
    # Featured feedback for homepage
    path('featured-feedback/', featured_feedback, name='featured_feedback'),
    
    # Chat endpoints
    path('chat/', chat_message, name='chat_message'),
    path('chat/history/<str:session_id>/', chat_history, name='chat_history'),
    path('chat/clear/<str:session_id>/', chat_clear, name='chat_clear'),
    path('chat/summary/', chat_summary, name='chat_summary'),
    
    # Password reset endpoints
    path('request-reset/', request_reset, name='request_reset'),
    path('verify-code-reset/', verify_code_reset, name='verify_code_reset'),
]
