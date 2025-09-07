# EduConnect - Frontend

This is the frontend for the EduConnect application, built with React and Vite.

## Features

- User authentication (login, register, logout)
- Protected routes for authenticated users
- Admin routes for admin users
- University browsing and details
- Course browsing and details
- Course comparison functionality
- User dashboard with saved courses
- Admin dashboard for content management

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```
4. Make sure the backend server is running at http://localhost:8000
5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

The application will be available at http://localhost:5173

## Environment Variables

The application requires the following environment variables:

```
VITE_API_URL=http://localhost:8000
```

This is already set up in the .env file.

## Login Credentials

You can use the following credentials to log in (after running the populate_db command on the backend):

- Admin User:
  - Username: admin
  - Password: adminpassword

- Student User:
  - Username: student
  - Password: studentpassword

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the production version
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Folder Structure

- `src/` - Source code
  - `components/` - Reusable components
  - `contexts/` - React contexts (AuthContext)
  - `pages/` - Application pages
  - `utils/` - Utility functions
  - `App.jsx` - Main application component
  - `Routes.jsx` - Application routes
  - `index.jsx` - Application entry point
