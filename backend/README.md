# EduConnect - Backend

This is the backend API for the EduConnect application, built with Django and Django REST Framework.

## Features

- User authentication with JWT tokens
- User profiles with roles (student, admin)
- University and course management
- Course comparison functionality
- User saved courses management

## Prerequisites

- Python 3.8+
- pip

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```
   python manage.py migrate
   ```
5. Populate the database with sample data:
   ```
   python manage.py populate_db
   ```
6. Run the development server:
   ```
   python manage.py runserver
   ```

The API will be available at http://localhost:8000/api/

## API Endpoints

### Authentication
- `POST /api/token/` - Get JWT tokens
- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/register/` - Register a new user
- `GET /api/user/` - Get current user details

### Universities
- `GET /api/universities/` - List all universities
- `GET /api/universities/<id>/` - Get university details
- `POST /api/universities/` - Create university (admin only)
- `PUT /api/universities/<id>/` - Update university (admin only)
- `DELETE /api/universities/<id>/` - Delete university (admin only)

### Courses
- `GET /api/courses/` - List all courses
- `GET /api/courses/<id>/` - Get course details
- `POST /api/courses/` - Create course (admin only)
- `PUT /api/courses/<id>/` - Update course (admin only)
- `DELETE /api/courses/<id>/` - Delete course (admin only)

### User Saved Courses
- `GET /api/saved-courses/` - List user's saved courses
- `POST /api/saved-courses/` - Save a course
- `DELETE /api/saved-courses/<id>/` - Remove a saved course

