// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, loading, checkAuth } = useAuth();
  const location = useLocation();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Helper to check for presence of stored authentication
  const hasStoredAuth = () => {
    return localStorage.getItem('auth_token') || localStorage.getItem('auth_user');
  };
  
  // Function to verify authentication on each route change
  const verifyAuth = async (force = false) => {
    // Prevent multiple simultaneous verifications
    if (isVerifying && !force) return;
    
    setIsVerifying(true);
    console.log('[ProtectedRoute] Verifying authentication for path:', location.pathname);

    try {
      // Always verify on protected routes, even if we think we're authenticated
      await checkAuth(false); // false means don't force redirect
      
      // Auth check complete
      setCheckedAuth(true);
    } catch (error) {
      console.error("[ProtectedRoute] Error verifying authentication:", error);
      // If there's an authentication error, mark auth as checked but failed
      setCheckedAuth(true);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Run auth check when the component mounts and when the route changes
  useEffect(() => {
    // Immediate verification on mount or route change
    verifyAuth(true);
    
    // Set up interval to periodically verify auth while on protected pages
    const verificationInterval = setInterval(() => {
      // Only verify if we think we're authenticated
      if (isAuthenticated) {
        console.log('[ProtectedRoute] Running periodic auth verification');
        verifyAuth();
      }
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      console.log('[ProtectedRoute] Cleaning up verification interval');
      clearInterval(verificationInterval);
    };
  }, [location.pathname]);

  // Show loading spinner while initial authentication check is happening
  if (loading || (isVerifying && !checkedAuth)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="ml-3">Verifying access...</p>
      </div>
    );
  }

  // Once we've checked auth status, redirect if not authenticated
    if (!isAuthenticated) {
      console.log('[ProtectedRoute] Not authenticated, redirecting to login');
      // Not authenticated, redirect to login, pass previous location
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render children
  console.log('[ProtectedRoute] Access verified for', user?.username || 'user');
  return children;
}
