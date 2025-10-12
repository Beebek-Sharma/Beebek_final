// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  
  // Handle error message from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      alert(error);
    }
    
    const msg = params.get('msg');
    if (msg) {
      alert(msg);
    }
  }, [location]);

  // Import CSRF and axios modules
  const [csrfModule, setCSRFModule] = useState(null);
  const [axiosInstance, setAxiosInstance] = useState(null);

  // Load modules on component mount
  useEffect(() => {
    // Import the csrf module
    import('../utils/csrf').then((module) => {
      setCSRFModule(module);
    });

    // Import the axiosConfig module
    import('../utils/axiosConfig').then((module) => {
      setAxiosInstance(module.default);
    });
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Ensure we have both modules loaded
      if (!csrfModule || !axiosInstance) {
        throw new Error('Module dependencies not loaded yet. Please try again.');
      }
      
      // Ensure we have a fresh CSRF token before login
      await csrfModule.fetchCSRFToken();
      
      // Use axiosInstance instead of fetch for consistent URL handling
      const response = await axiosInstance.post('/auth/login/', {
        username,
        password
      });
      
      const data = response.data;
      if (data.user) {
        // Store user data for immediate access
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        // Store token if provided (for fallback auth)
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        // Redirect to home page
        window.location.href = '/';
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || error.message || 'Login failed. Please try again.');
    }
  };
  
  const handleGoogleLogin = () => {
    console.log('[Login] Starting Google OAuth login flow');
    
    // Clear ALL authentication and state information before Google login
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('google_auth_success');
    localStorage.removeItem('auth_check_pending');
    localStorage.removeItem('google_login_success_time');
    
    // Set a flag to detect successful Google login on return
    localStorage.setItem('google_login_pending', 'true');
    
    // Clear all cookies that might interfere with authentication
    const cookieNames = ['google_auth_success', 'csrftoken'];
    cookieNames.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    // Generate unique identifiers for this login attempt to prevent caching
    const loginUid = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    
    // Encode the frontend URL as the redirect_uri with cache-busting parameters
    const frontendUrl = window.location.origin;
    const redirectUri = encodeURIComponent(
      `${frontendUrl}/?time=${timestamp}`
    );
    
    // Construct the Google OAuth login URL with additional parameters to prevent caching
    // Our custom callback handler will ensure proper cookies are set
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const loginUrl = `${backendUrl}/accounts/google/login/?process=login&next=${redirectUri}&_=${timestamp}&nonce=${loginUid}`;
    
    console.log('[Login] Redirecting to Google OAuth URL:', loginUrl);
    window.location.href = loginUrl;
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border p-2" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
      
      {/*
      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded bg-white hover:bg-gray-50"
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
          s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
          s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
          l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
          c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
          c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        <span>Sign in with Google</span>
      </button>
      */}
    </div>
  );
}

export default Login;