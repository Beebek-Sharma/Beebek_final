import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const LogoutPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [logoutAttempted, setLogoutAttempted] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);
  
  // Try logout on component mount
  useEffect(() => {
    const attemptLogout = async () => {
      try {
        // Clear client-side auth state first
        await logout();
        setLogoutAttempted(true);
        
        // Send a direct request to backend logout endpoint
        try {
          // Use axiosInstance for consistent URL handling
          const axiosInstance = require('../utils/axiosConfig').default;
          await axiosInstance.post('/auth/logout/');
          
          console.log("Server-side logout completed successfully");
          
          // Clear all auth-related storage
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('last_auth_time');
          
          // Clear all cookies that might be related to auth
          document.cookie.split(";").forEach(function(c) {
            const cookie = c.trim();
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
          });
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
          
        } catch (err) {
          console.error("Error during server-side logout:", err);
          setLogoutFailed(true);
        }
      } catch (error) {
        console.error("Logout failed with error:", error);
        setLogoutFailed(true);
        setLogoutAttempted(true);
      }
    };
    
    attemptLogout();
  }, [logout]);
  
  // Force logout function - more aggressive approach
  const forceLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Delete cookies with different combinations of path/domain
    document.cookie.split(";").forEach(function(c) {
      const cookie = c.trim();
      const name = cookie.split("=")[0].trim();
      
      // Try multiple combinations to ensure the cookie is removed
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    });
    
    // Create an iframe to clear cookies from other domains if applicable
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Use the full backend URL to ensure correct domain
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    iframe.src = `${backendUrl}/api/auth/csrf/`;  // Access API endpoint to clear cookies
    
    // Send a direct request to logout endpoint as backup
    fetch(`${backendUrl}/api/auth/logout/`, {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      // Always redirect after a short delay to ensure cookies are processed
      setTimeout(() => {
        // Hard redirect to home page
        window.location.href = '/';
      }, 300);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-github-dark p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {logoutAttempted 
            ? (logoutFailed ? "Logout Problem Detected" : "Logging Out...") 
            : "Logging Out..."}
        </h1>
        
        {logoutFailed ? (
          <div className="space-y-6">
            <p className="text-red-600 dark:text-red-400">
              There was a problem logging you out. Your session may still be active.
            </p>
            
            <button 
              onClick={forceLogout}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md"
            >
              Force Logout
            </button>
            
            <div className="mt-4">
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Securely logging you out of your account...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;