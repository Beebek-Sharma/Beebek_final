# EduConnect

EduConnect is an educational platform that helps students browse, compare, and save university courses. The application features a Django REST Framework backend and a React (Vite) frontend.

## Project Structure

The project is organized into two main folders:

- `backend/`: Django REST API with JWT authentication
- `frontend/`: React application built with Vite

## Features

- Browse universities and courses
- Compare courses side by side
- User authentication and authorization with JWT
- Role-based access control (student and admin roles)
- Admin dashboard for managing universities, courses, and users
- User dashboard for managing saved courses
- Contact Us page with contact form and FAQs
- Interactive location map with Google Maps integration
- Social media integration with links to popular platforms
- Consistent footer with navigation and social links across all pages
- Responsive design with TailwindCSS

## Requirements

### Backend
- Python 3.10+
- Django 5.0+
- Django REST Framework
- djangorestframework-simplejwt

### Frontend
- Node.js 18+
- npm 9+
- React 18
- Vite 6+

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
	```bash
	cd backend
	```

2. Create a virtual environment:
	```bash
	python -m venv venv
	```

3. Activate the virtual environment:
	- Windows:
	  ```bash
	  venv\Scripts\activate
	  ```
	- macOS/Linux:
	  ```bash
	  source venv/bin/activate
	  ```

4. Install dependencies:
	```bash
	pip install -r requirements.txt
	```

5. (If you see a pkg_resources error, install setuptools):
	```bash
	pip install setuptools
	```

6. Apply migrations:
	```bash
	python manage.py migrate
	```

7. Populate the database with sample data (admin, student, universities, courses):
	```bash
	python manage.py populate_db
	```

8. Run the development server:
	```bash
	python manage.py runserver
	```


The backend API will be available at: http://localhost:8000/

### Frontend Setup

1. Navigate to the frontend directory:
	```bash
	cd frontend
	```

2. Install dependencies:
	```bash
	npm install
	```

3. Create a `.env` file in the frontend directory with the following content:
	```
	VITE_API_URL=http://localhost:8000
	```

4. Start the development server:
	```bash
	npm run dev
	```

The frontend application will be available at: http://localhost:5173/ or http://localhost:5174/ (if port 5173 is in use)

## Running the Project

To run the complete project:

1. Start the backend server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to the frontend URL (typically http://localhost:5173/)

## UI/UX Features

### Responsive Design
- Mobile-first approach with responsive layouts
- Adaptive navigation with hamburger menu on small screens
- Flexible grid system for content display

### User Experience
- Consistent navigation with header and footer on all pages
- Form validation with helpful error messages
- Loading states for asynchronous operations
- Optimized page transitions

### Social Media Integration
- Footer with links to Facebook, Twitter, Instagram, LinkedIn, and YouTube
- Share functionality for courses and universities

### Location Services
- Interactive Google Maps integration on the Contact page
- Location-based university search

## API Endpoints

### Authentication
- `POST /api/auth/register/`: Register a new user
- `POST /api/auth/login/`: Log in a user
- `POST /api/auth/token/refresh/`: Refresh JWT token
- `GET /api/auth/me/`: Get current user profile

### Universities
- `GET /api/universities/`: List all universities
- `POST /api/universities/`: Create a new university (admin only)
- `GET /api/universities/:id/`: Get university details
- `PUT /api/universities/:id/`: Update university (admin only)
- `DELETE /api/universities/:id/`: Delete university (admin only)

### Courses
- `GET /api/courses/`: List all courses (with optional filtering)
- `POST /api/courses/`: Create a new course (admin only)
- `GET /api/courses/:id/`: Get course details
- `PUT /api/courses/:id/`: Update course (admin only)
- `DELETE /api/courses/:id/`: Delete course (admin only)

### User Saved Courses
- `GET /api/user/saved-courses/`: List user's saved courses
- `POST /api/user/saved-courses/`: Save a course
- `DELETE /api/user/saved-courses/:id/`: Remove a saved course

### Admin
- `GET /api/users/`: List all users (admin only)
- `PUT /api/users/:id/`: Update user information (admin only)
- `DELETE /api/users/:id/`: Delete user (admin only)

## Database Population

To populate the database with sample data:

```bash
cd backend
python manage.py populate_db
```

This will create sample universities, courses, and users for testing.

## User Roles

The application supports two user roles:

1. **Student**: Can browse, compare, and save courses
2. **Admin**: Can manage universities, courses, and users through the admin dashboard

## Key Components

### Pages
- **Home**: Landing page with featured universities and courses
- **Universities List**: Browse all available universities
- **University Detail**: View detailed information about a specific university
- **Courses List**: Browse all available courses with filtering options
- **Course Detail**: View detailed information about a specific course
- **Course Comparison**: Compare multiple courses side by side
- **About**: Information about the EduConnect platform
- **Contact Us**: Contact form, location information with Google Maps, and FAQs
- **User Dashboard**: Manage saved courses and account settings
- **Admin Dashboard**: Manage universities, courses, and users (admin only)
- **Login/Register**: User authentication pages

### Reusable Components
- **Header**: Navigation bar with responsive design for mobile and desktop
- **Footer**: Consistent footer with navigation links and social media integration
- **ErrorBoundary**: Catches and displays errors gracefully
- **ProtectedRoute**: Handles route protection based on authentication
- **AdminRoute**: Ensures routes are accessible only to admin users
- **UserRoleIndicator**: Displays the current user's role
- **ScrollToTop**: Ensures page scrolls to top on navigation

## Deployment Notes

For production deployment:

1. Set appropriate environment variables for both backend and frontend
2. Configure a production database (PostgreSQL recommended)
3. Set up static file serving for the Django admin
4. Build the frontend for production:
	```bash
	cd frontend
	npm run build
	```
5. Serve the built frontend files using a web server (Nginx, Apache, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
