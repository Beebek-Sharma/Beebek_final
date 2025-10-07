import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Component to verify authentication on route changes
 * This component doesn't render anything, it just listens for route changes
 * and triggers authentication checks when the user navigates to a new route
 */
const RouteChangeListener = () => {
  const location = useLocation();
  const { checkAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('[RouteListener] Route changed to:', location.pathname);
    
    // Skip auth checks on public routes unless already authenticated
    const isPublicRoute = ['/login', '/register', '/about', '/contact', '/'].some(
      path => location.pathname.startsWith(path)
    );
    
    if (!isPublicRoute || isAuthenticated) {
      console.log('[RouteListener] Verifying authentication on route change');
      checkAuth(false); // Don't force redirect, just verify auth
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default RouteChangeListener;