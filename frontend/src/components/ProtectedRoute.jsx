// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from 'react-router-dom';

import { useUser } from '@clerk/clerk-react';


export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
