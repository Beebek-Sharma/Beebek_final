from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('admin', 'Admin'),
        ('superuser_admin', 'Superuser Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    @property
    def is_student(self):
        return self.role == 'student'

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_superuser_admin(self):
        return self.role == 'superuser_admin' or self.is_superuser

class Submission(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)  # For demo only; don't store plain passwords in real apps!
    created_at = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='profile')
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)  # Legacy field, use profile_picture instead
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    bio = models.TextField(max_length=140, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
        
    def save(self, *args, **kwargs):
        # Ensure the media directories exist
        import os
        from django.conf import settings
        
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)
            
        profile_pics_dir = os.path.join(settings.MEDIA_ROOT, 'profile_pics')
        if not os.path.exists(profile_pics_dir):
            os.makedirs(profile_pics_dir)
            
        super().save(*args, **kwargs)

class University(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100)
    ranking = models.IntegerField(null=True, blank=True)
    website = models.URLField()
    image = models.CharField(max_length=255, null=True, blank=True)  # URL to image
    
    def __str__(self):
        return self.name

class Course(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=50)  # e.g., "3 years", "4 semesters"
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    level = models.CharField(max_length=50)  # e.g., "Undergraduate", "Postgraduate"
    
    def __str__(self):
        return f"{self.name} at {self.university.name}"

class UserSavedCourse(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='saved_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'course']
    
    def __str__(self):
        return f"{self.user.username} saved {self.course.name}"

class Feedback(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='feedbacks')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Feedback from {self.user.username}: {self.subject}"


class FeedbackResponse(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='responses')
    admin = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='feedback_responses')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Response to {self.feedback.subject} by {self.admin.username}"

# Notification model for user/admin notifications
class Notification(models.Model):
    recipient = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey('CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    # Optionally, type: 'user', 'admin', etc.
    type = models.CharField(max_length=20, default='user')

    def __str__(self):
        return f"Notification to {self.recipient.username}: {self.message[:30]}"