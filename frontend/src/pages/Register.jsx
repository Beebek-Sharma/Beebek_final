
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { validateUsername, validateEmail, validatePassword, validateName, validatePasswordMatch } from '../utils/validation';
import LiquidEther from '../components/LiquidEther';

const Register = () => {
  const { register, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let fieldErrors = [];
    
    switch (name) {
      case 'username':
        fieldErrors = validateUsername(value);
        break;
      case 'email':
        fieldErrors = validateEmail(value);
        break;
      case 'firstName':
        fieldErrors = validateName(value, 'First name');
        break;
      case 'lastName':
        fieldErrors = validateName(value, 'Last name');
        break;
      case 'password':
        fieldErrors = validatePassword(value);
        break;
      case 'confirmPassword':
        fieldErrors = validatePasswordMatch(formData.password, value);
        break;
      default:
        break;
    }
    
    if (fieldErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[0],
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const usernameErrors = validateUsername(formData.username);
    if (usernameErrors.length > 0) newErrors.username = usernameErrors[0];
    
    const emailErrors = validateEmail(formData.email);
    if (emailErrors.length > 0) newErrors.email = emailErrors[0];
    
    const firstNameErrors = validateName(formData.firstName, 'First name');
    if (firstNameErrors.length > 0) newErrors.firstName = firstNameErrors[0];
    
    const lastNameErrors = validateName(formData.lastName, 'Last name');
    if (lastNameErrors.length > 0) newErrors.lastName = lastNameErrors[0];
    
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) newErrors.password = passwordErrors[0];
    
    const matchErrors = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (matchErrors.length > 0) newErrors.confirmPassword = matchErrors[0];
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Register the user
      await register(formData.email, formData.password, formData.username, formData.firstName, formData.lastName);

      // Attempt automatic login with the same credentials
      try {
        await login(formData.email, formData.password);
        // After successful login, redirect to home page
        setTimeout(() => {
          setLoading(false);
          navigate('/', { replace: true });
        }, 300);
      } catch (loginErr) {
        // If login fails, redirect to login page
        setLoading(false);
        navigate('/login', { 
          replace: true, 
          state: { message: 'Registration successful! Please log in.' }
        });
      }
    } catch (err) {
      // Registration error - extract backend validation errors
      const backendErrors = {};
      if (err.response?.data) {
        Object.keys(err.response.data).forEach(key => {
          if (Array.isArray(err.response.data[key])) {
            backendErrors[key] = err.response.data[key][0];
          } else if (typeof err.response.data[key] === 'string') {
            backendErrors[key] = err.response.data[key];
          }
        });
      }
      
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.response?.data?.error || 'Registration failed. Please try again.' });
      }
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
  // Redirect to Django allauth social login
  window.location.href = `http://localhost:8000/accounts/${provider}/login/`;
  };

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden bg-white dark:bg-gray-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={40}
          cursorSize={150}
          autoDemo={true}
          autoSpeed={0.8}
          autoIntensity={2.5}
          resolution={1}
          isBounce={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/20 max-h-[95vh] overflow-y-auto scrollbar-hide">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Join us to explore universities and courses
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                touched.firstName && errors.firstName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
              }`}
              required
              disabled={loading}
            />
            {touched.firstName && errors.firstName && (
              <p className="mt-0.5 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                touched.lastName && errors.lastName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
              }`}
              required
              disabled={loading}
            />
            {touched.lastName && errors.lastName && (
              <p className="mt-0.5 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                touched.username && errors.username 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
              }`}
              required
              disabled={loading}
            />
            {touched.username && errors.username && (
              <p className="mt-0.5 text-xs text-red-600">{errors.username}</p>
            )}
            <p className="mt-0.5 text-xs text-gray-500">3-30 characters, letters, numbers, and underscores only</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                touched.email && errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
              }`}
              required
              disabled={loading}
            />
            {touched.email && errors.email && (
              <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  touched.password && errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
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
              <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
            )}
            <p className="mt-0.5 text-xs text-gray-500">
              8+ chars, uppercase, lowercase, number, special char
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  touched.confirmPassword && errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
                }`}
                required
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13M6.13 6.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.17 4.53M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.13 6.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.17 4.53M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13" /></svg>
                )}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-0.5 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/*
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or sign up with
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

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
