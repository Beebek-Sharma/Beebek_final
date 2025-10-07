from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    """
    Permission class to check if user is a student.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_student


class IsSuperuserAdmin(permissions.BasePermission):
    """
    Permission class to check if user is a superuser admin.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser_admin


class IsStudentOrReadOnly(permissions.BasePermission):
    """
    Permission class to allow read-only access for everyone, 
    but write access only for students.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_student


class IsSuperuserAdminOrReadOnly(permissions.BasePermission):
    """
    Permission class to allow read-only access for everyone,
    but write access only for superuser admins.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_superuser_admin
