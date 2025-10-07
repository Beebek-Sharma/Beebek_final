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
        // First, perform normal logout
        await logout();
        setLogoutAttempted(true);
        
        // Check after a delay if we're still authenticated
        setTimeout(async () => {
          // Add a verification request to double-check auth status
          try {
            // Try to access a protected endpoint
            await axiosInstance.get('/auth/user/');
            // If we get here, we're still authenticated
            console.error("Still authenticated after logout attempt!");
            setLogoutFailed(true);
          } catch (err) {
            if (err.response?.status === 401) {
              // 401 means we're properly logged out
              console.log("Logout successful - verified with 401 response");
              // Redirect to home page
              window.location.href = '/';
            } else {
              // Other errors - assume logout failed
              console.error("Error verifying logout:", err);
              setLogoutFailed(true);
            }
          }
        }, 1000);
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
    iframe.src = '/api/auth/csrf/';  // Access API endpoint to clear cookies
    
    // Send a direct request to logout endpoint as backup
    fetch('/api/auth/logout/', {
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