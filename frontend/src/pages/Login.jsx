import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionMsg, setSessionMsg] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // When component mounts, ensure we're in a clean state for login
  useEffect(() => {
    // Clear auth_refreshing flag to unblock login attempts
    localStorage.removeItem('auth_refreshing');
    
    // Reset any stuck auth state when directly accessing the login page
    if (window.location.pathname === '/login') {
      console.log("[Login] Directly accessing login page, ensuring clean auth state");
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('last_auth_time');
    }
    
    // Set message from URL if present
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    if (msg) setSessionMsg(msg);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Add a small delay to ensure any stale auth operations have completed
    console.log("[Login] Adding delay before login to ensure clean state");
    await new Promise(resolve => setTimeout(resolve, 300));

    // Clear the 'msg' parameter from the URL to avoid session issues
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('msg')) {
        url.searchParams.delete('msg');
        window.history.replaceState({}, document.title, url.toString());
        console.log("[Login] Cleared 'msg' parameter from URL");
        // Also clear sessionMsg state to hide the "Logged out successfully" message
        setSessionMsg('');
      }
    } catch (e) {
      console.error("[Login] Error clearing URL params:", e);
    }

    console.log("[Login] Attempting login with:", loginId);

    // Basic validation
    if (!loginId || !password) {
      setError('Username/Email and password are required');
      setLoading(false);
      return;
    }
    // Password validation: at least 8 chars, at least one letter and one number
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain at least one letter and one number');
      setLoading(false);
      return;
    }

    try {
      // Make sure any previous auth state is cleared before login
      if (localStorage.getItem('auth_refreshing') === 'true') {
        console.log("[Login] Clearing stuck auth_refreshing flag");
        localStorage.removeItem('auth_refreshing');
      }

      // Attempt to login
  const response = await login(loginId, password);
      console.log("[Login] Login successful:", response);

      // Redirect to last visited page or home after a longer delay
      // This gives the browser time to process cookies and token state
      setTimeout(() => {
        // Double check we're still authenticated before navigating
        if (!localStorage.getItem('auth_token') && !localStorage.getItem('auth_user')) {
          console.error("[Login] Authentication data missing after login!");
          setError("Login was successful but session data is missing. Please try again.");
          setLoading(false);
          return;
        }
        
        // Log current auth state for debugging
        console.log("[Login] Auth state before redirect:", {
          token: !!localStorage.getItem('auth_token'),
          user: !!localStorage.getItem('auth_user'),
          cookies: document.cookie
        });
        
        const lastVisited = localStorage.getItem('last_visited_page');
        const from = location.state?.from || lastVisited || '/';
        console.log("[Login] Redirecting to:", from, "state:", location.state, "lastVisited:", lastVisited);
        setLoading(false);
        
        // Use replace true to prevent back button issues
        navigate(from, { replace: true });
      }, 800); // Longer delay for more reliable cookie processing
    } catch (err) {
      console.error("[Login] Login error:", err);
      console.error("[Login] Error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });

      // Detailed error handling
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your email or username and password.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || 'Invalid form data. Please check your inputs.');
      } else if (err.message?.includes('Authentication verification failed')) {
        setError('Authentication succeeded but session verification failed. This may be a cookie issue.');
      } else {
        setError(err.response?.data?.error || err.message || 'Login failed. Please try again.');
      }

      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
  // Redirect to Django allauth social login
  window.location.href = `http://localhost:8000/accounts/${provider}/login/`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-github-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your account
          </p>
        </div>

        {sessionMsg && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {sessionMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email or Username
            </label>
            <input
              id="loginId"
              type="text"
              placeholder="Enter your email or username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 ">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Forgot password?{' '}
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Reset it here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
