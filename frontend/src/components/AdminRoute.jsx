
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading, checkAuth } = useAuth();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);

  // When the component mounts or the route changes, verify admin access
  useEffect(() => {
    const verifyAdminAccess = async () => {
      console.log('[AdminRoute] Verifying admin access');
      setVerifying(true);
      
      try {
        // Always verify authentication when accessing admin routes
        await checkAuth(false); // false means don't force redirect
      } catch (error) {
        console.error('[AdminRoute] Error verifying authentication:', error);
      } finally {
        setVerifying(false);
      }
    };
    
    verifyAdminAccess();
  }, [location.pathname]);

  // Show loading spinner while checking auth
  if (loading || verifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="ml-3">Verifying admin access...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('[AdminRoute] Not authenticated, redirecting to login');
    // Not authenticated, redirect to login, pass previous location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Redirect to access denied if not an admin
  if (!(user?.role === 'admin' || user?.role === 'superuser_admin')) {
    console.log('[AdminRoute] Not an admin, redirecting to access denied');
    return <Navigate to="/access-denied" replace />;
  }

  // User is authenticated and has admin role
  console.log('[AdminRoute] Admin access verified');
  return children;
};

export default AdminRoute;
