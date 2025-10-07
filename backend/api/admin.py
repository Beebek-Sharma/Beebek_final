from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .models import Submission, UserProfile, University, Course, UserSavedCourse, Feedback, FeedbackResponse

# Register your models here.
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User Profile'

# Extend the User admin
class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_role')
    
    def get_role(self, obj):
        return obj.role if hasattr(obj, 'role') else '-'
    get_role.short_description = 'Role'

# Re-register UserAdmin
admin.site.register(CustomUser, CustomUserAdmin)

# Register University
@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'ranking', 'website')
    search_fields = ('name', 'location')
    list_filter = ('location',)

# Register Course
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'university', 'level', 'duration', 'fees')
    search_fields = ('name', 'university__name')
    list_filter = ('university', 'level')

# Register UserSavedCourse
@admin.register(UserSavedCourse)
class UserSavedCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'saved_at')
    list_filter = ('user', 'course__university')

# Register Submission (if needed)
@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('username', 'created_at')
    readonly_fields = ('username', 'password', 'created_at')  # password should be readonly for security

# Register Feedback
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('subject', 'user', 'created_at', 'is_resolved')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('subject', 'message', 'user__username')

# Register FeedbackResponse
@admin.register(FeedbackResponse)
class FeedbackResponseAdmin(admin.ModelAdmin):
    list_display = ('feedback', 'admin', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message', 'feedback__subject', 'admin__username')
