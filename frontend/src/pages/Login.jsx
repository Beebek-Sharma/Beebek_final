import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { validateLogin } from '../utils/validation';

const Login = () => {
  const { login } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessionMsg, setSessionMsg] = useState('');
  const [touched, setTouched] = useState({});
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
    setErrors({});
    
    // Mark fields as touched
    setTouched({ loginId: true, password: true });
    
    // Validate inputs
    const validationErrors = validateLogin(loginId, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
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
            setErrors({ general: "Login was successful but session data is missing. Please try again." });
            setLoading(false);
            return;
          }

          // Clean and reliable redirection logic
          let lastVisited = localStorage.getItem('last_visited_page');
          // If lastVisited is login/register, ignore it
          if (lastVisited && (/^\/login/.test(lastVisited) || /^\/register/.test(lastVisited))) {
            lastVisited = null;
          }
          const from = location.state?.from || lastVisited || '/';
          console.log("[Login] Redirecting to:", from, "state:", location.state, "lastVisited:", lastVisited);
          setLoading(false);
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
        setErrors({ general: 'Invalid credentials. Please check your email or username and password.' });
      } else if (err.response?.status === 400) {
        setErrors({ general: err.response.data.error || 'Invalid form data. Please check your inputs.' });
      } else if (err.message?.includes('Authentication verification failed')) {
        setErrors({ general: 'Authentication succeeded but session verification failed. This may be a cookie issue.' });
      } else {
        setErrors({ general: err.response?.data?.error || err.message || 'Login failed. Please try again.' });
      }

      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
      // Store last visited page before redirecting to social login
      const publicPaths = ['/login', '/register'];
      const currentPath = window.location.pathname + window.location.search;
      if (!publicPaths.some(p => window.location.pathname.startsWith(p))) {
        localStorage.setItem('last_visited_page', currentPath);
      }
      // Redirect to Django allauth social login
      window.location.href = `http://localhost:8000/accounts/${provider}/login/`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-github-dark">
      <div className="w-full max-w-xs bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
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

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email or Username *
            </label>
            <input
              id="loginId"
              type="text"
              placeholder="Enter your email or username"
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
              onBlur={() => setTouched({ ...touched, loginId: true })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                touched.loginId && errors.username 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              }`}
              required
              disabled={loading}
            />
            {touched.loginId && errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    touched.password && errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13M6.13 6.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.17 4.53M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.13 6.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.17 4.53M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13" /></svg>
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
            <div className="mt-3 flex justify-center">
              <Link to="/forgot-password" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                Forgot password? <span className="underline">Reset it here</span>
              </Link>
            </div>
        </form>

          {/*
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
          */}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
