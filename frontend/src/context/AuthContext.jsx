import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axiosInstance from "../utils/axiosConfig";
import axios from "axios";

const AuthContext = createContext();

// Debug utility function
const logAuthState = (label, user, isAuthenticated) => {
  console.log(`[AuthState:${label}]`, {
    user,
    isAuthenticated,
    visibleCookies: document.cookie,
    path: window.location.pathname,
    tokenInStorage: !!localStorage.getItem('auth_token'),
  });
};

// Detect if we're using browsers with strict privacy settings or if cookies don't work properly
const detectPrivacyBrowser = () => {
  // Store detection results
  const results = {
    isPrivacyFocused: false,
    cookiesWork: true,
    cookiesBlocked: false
  };
  
  // Check browser fingerprinting signals
  try {
    // Check known privacy-focused browsers by feature detection rather than UA sniffing
    const userAgent = navigator.userAgent || '';
    
    // Privacy-focused browser indicators (more reliable than direct API calls)
    const privacySignals = [
      userAgent.indexOf("Brave") !== -1,          // Brave browser
      userAgent.indexOf("Firefox") !== -1 && (    // Firefox with tracking protection
        navigator.doNotTrack === "1" || 
        navigator.doNotTrack === "yes"
      ),
      // Edge/Safari with privacy features (indirect detection)
      typeof navigator.globalPrivacyControl !== 'undefined',
      // Browsers in private/incognito mode often have cookie limitations
      !window.localStorage
    ];
    
    results.isPrivacyFocused = privacySignals.some(signal => signal === true);
  } catch (e) {
    console.error('[Auth] Error checking browser privacy features:', e);
  }
  
  // Cookie functionality test - critical check regardless of browser type
  try {
    // Clear any previous test cookie
    document.cookie = "auth_test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Test if we can set and read a cookie
    const testCookieName = 'auth_test_cookie';
    const testValue = 'test_' + Math.random().toString(36).substring(2, 7);
    const now = new Date();
    const expires = new Date(now.getTime() + 10000); // 10 seconds
    
    // Try setting a test cookie with modern attributes
    document.cookie = `${testCookieName}=${testValue}; path=/; expires=${expires.toUTCString()}; SameSite=None`;
    
    // Check if cookie was successfully set
    const cookieExists = document.cookie.split(';').some(cookie => {
      return cookie.trim().startsWith(`${testCookieName}=`);
    });
    
    // Also check if the value matches what we set
    const cookieValue = document.cookie.split(';')
      .find(cookie => cookie.trim().startsWith(`${testCookieName}=`))
      ?.split('=')[1];
    
    results.cookiesWork = cookieExists && cookieValue === testValue;
    
    // Check if cookies are entirely blocked
    results.cookiesBlocked = document.cookie === '' && window.navigator.cookieEnabled === true;
    
    // Clean up test cookie
    document.cookie = `${testCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (e) {
    console.error('[Auth] Error testing cookie functionality:', e);
    results.cookiesWork = false; // Assume cookies don't work if we get an error
  }
  
  console.log('[Auth] Browser privacy detection:', { 
    ...results,
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled
  });
  
  // Return true if this is a privacy browser or cookies don't work reliably
  return results.isPrivacyFocused || !results.cookiesWork || results.cookiesBlocked;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Track if auth has been checked
  const [usingTokenFallback, setUsingTokenFallback] = useState(false);
  
  // Initialize authentication strategy on mount
  useEffect(() => {
    try {
      console.log('[Auth] Initializing authentication strategy');
      
      // Check if we already have a token in localStorage
      const hasToken = !!localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (hasToken && storedUser) {
        // If we already have a token, prefer token-based auth for consistency
        setUsingTokenFallback(true);
        console.log('[Auth] Found existing token in localStorage, using token-based authentication');
        
        // Pre-load user from localStorage to avoid flash of unauthenticated content
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (e) {
          console.error('[Auth] Failed to parse stored user:', e);
        }
      }
      
      // Always check browser compatibility regardless of token presence
      // This helps us adapt if a user's browser settings change
      const needsFallback = detectPrivacyBrowser();
      
      // If we need fallback but don't have a token yet, set the flag for future logins
      if (needsFallback) {
        console.log('[Auth] Privacy-focused browser or cookie issues detected, will use token fallback');
        setUsingTokenFallback(true);
      } else if (!hasToken) {
        // Only switch to cookie auth if we don't have a token and cookies work
        console.log('[Auth] Standard browser with cookie support detected, preferring cookie authentication');
        setUsingTokenFallback(false);
      }
      
      // Log the final authentication strategy
      console.log('[Auth] Authentication strategy initialized:', {
        usingTokenFallback: needsFallback || hasToken,
        hasExistingToken: hasToken,
        needsFallback: needsFallback
      });
    } catch (err) {
      // If there's any error in detection, use both strategies for reliability
      console.error('[Auth] Error in authentication initialization:', err);
      // Default to token auth as it's more reliable across browsers
      setUsingTokenFallback(true);
    }
  }, []);
  
  // Log auth state changes
  useEffect(() => {
    logAuthState('StateChange', user, isAuthenticated);
  }, [user, isAuthenticated]);
  
  // Listen for route changes, store last visited non-auth page, and verify auth if needed
  useEffect(() => {
    // Function to handle location changes
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      console.log('[Auth] Route changed to:', currentPath);

      // Store last visited page for all routes except /login and /register
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.setItem('last_visited_page', currentPath);
      }

      // NEVER verify auth on login or register pages to prevent loops
      if (currentPath === '/login' || currentPath === '/register') {
        console.log('[Auth] Login/Register path detected, skipping ALL auth checks');
        return;
      }

      // Skip auth check on public paths or if not authenticated
      if (isPublicPath(currentPath)) {
        console.log('[Auth] Public path detected, skipping auth check');
        return;
      }
      
      // Only verify auth if we think we're authenticated or have stored auth data
      if (isAuthenticated || localStorage.getItem('auth_token') || hasAuthCookie()) {
        console.log('[Auth] Protected path detected, verifying authentication');
        checkAuth(false); // Don't force redirect, just verify auth
      } else {
        console.log('[Auth] Protected path but no stored auth, skipping verification');
      }
    };

    // Set up event listener for history changes
    window.addEventListener('popstate', handleRouteChange);

    // React Router doesn't trigger popstate on all navigation types,
    // so we need to patch push/replace methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(this, arguments);
      handleRouteChange();
    };

    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      handleRouteChange();
    };

    // Store last visited page on initial load if not /login or /register
    const initialPath = window.location.pathname;
    if (initialPath !== '/login' && initialPath !== '/register') {
      localStorage.setItem('last_visited_page', initialPath);
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
  
  // Helper to determine if a path is a public path that doesn't require auth
  const isPublicPath = (path) => {
    // Check the raw path without search params
    const pathWithoutParams = path.split('?')[0];
    
    const publicPaths = [
      '/login',
      '/register',
      '/about',
      '/contact',
      '/universities',
      '/courses',
      '/search'
    ];
    // Check if path starts with any of the public paths or is root
    return publicPaths.some(p => pathWithoutParams.startsWith(p)) || pathWithoutParams === '/';
  };

  // Helper to check for presence of refresh token cookie or localStorage token
  const hasAuthCookie = () => {
    return document.cookie.split(';').some(c => c.trim().startsWith('refresh_token='));
  };
  
  // Helper to check if we have authentication in any form (cookie or token)
  const hasAuthentication = () => {
    // Check for cookie authentication
    const hasCookie = hasAuthCookie();
    
    // Check for token authentication
    const hasToken = !!localStorage.getItem('auth_token');
    
    console.log('[Auth] Authentication check:', { hasCookie, hasToken });
    
    return hasCookie || hasToken;
  };
  
  // First-time initialization effect to set up authentication
  useEffect(() => {
    console.log('[Auth] Application initializing, checking for stored authentication');
    
    const initializeAuth = async () => {
      // 1. First try to restore auth from localStorage for immediate UI display
      // This prevents flash of unauthenticated content
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');
      const lastAuthTime = localStorage.getItem('last_auth_time');

      // Fast-path: pre-load the user from localStorage if available
      if (storedUser && (storedToken || hasAuthCookie())) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('[Auth] Pre-loaded user from storage:', parsedUser.username);

          // If auth is fairly recent, we can trust it for a moment
          const authAge = lastAuthTime ? (Date.now() - parseInt(lastAuthTime)) / (60 * 1000) : 999;
          if (authAge < 10) { // Less than 10 minutes old
            console.log(`[Auth] Auth data is recent (${authAge.toFixed(1)} minutes), marking as temporarily valid`);
            setAuthChecked(true);
          }
        } catch (e) {
          console.error('[Auth] Failed to parse stored user:', e);
        }
      }

      // 2. Test cookies to determine if we need to use token fallback
      const testCookieWorks = () => {
        try {
          const testName = 'auth_cookie_test';
          const testValue = 'test_' + Date.now();
          document.cookie = `${testName}=${testValue}; path=/`;
          const cookieWorks = document.cookie.includes(`${testName}=${testValue}`);
          document.cookie = `${testName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          return cookieWorks;
        } catch (e) {
          console.error('[Auth] Error testing cookies:', e);
          return false;
        }
      };

      if (!testCookieWorks()) {
        console.log('[Auth] Cookie functionality test failed, using token fallback');
        setUsingTokenFallback(true);
      }

      // 3. Prevent immediate auth check on /login or /register
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/register') {
        console.log('[Auth] On login/register route, skipping initial auth check');
        setLoading(false);
        setAuthChecked(true);
        setIsAuthenticated(false);
        return;
      }

      const isProtectedRoute = !isPublicPath(currentPath);
      const hasAuthData = storedUser || storedToken || hasAuthCookie();

      // We should verify auth if:
      // - We're on a protected route, or 
      // - We have auth data that might be valid
      if (isProtectedRoute || hasAuthData) {
        console.log('[Auth] Verifying authentication with server');
        try {
          await checkAuth(false); // false means don't force redirect
        } catch (error) {
          console.error('[Auth] Error during initial auth check:', error);
        }
      } else {
        // Nothing to check - we're on a public route with no auth data
        console.log('[Auth] No auth to verify, on public route with no stored auth');
        setLoading(false);
        setAuthChecked(true);
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, []);

  const checkAuth = async (shouldRedirect = true) => {
    // Generate a unique ID for this auth check to help with debugging
    const checkId = Math.random().toString(36).substring(2, 8);
    console.log(`[Auth:${checkId}] Starting authentication check, shouldRedirect=${shouldRedirect}`);
    
    // Special case: If we're on the login page, don't perform any automatic auth checks
    // This helps avoid the circular login-logout issue
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') {
      console.log(`[Auth:${checkId}] On login/register page, skipping auth check to avoid circular redirects`);
      setLoading(false);
      setAuthChecked(true);
      return; // Keep existing auth state, don't reset it
    }
    
    // Don't check auth on public paths unless explicitly told to
    if (isPublicPath(currentPath) && !shouldRedirect && !hasAuthentication()) {
      console.log(`[Auth:${checkId}] Skipping check on public path with no stored auth`);
      setLoading(false);
      setAuthChecked(true);
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    
    setLoading(true);
    let authSucceeded = false;
    
    // IMPORTANT: Save the current auth state before checking
    // This helps prevent logout flashes during checks
    const wasAuthenticated = isAuthenticated;
    const previousUser = user;
    
    // Try the dedicated verification endpoint first - most accurate
    try {
      console.log(`[Auth:${checkId}] Using verification endpoint`);
      const response = await axiosInstance.get('/auth/verify/');
      console.log(`[Auth:${checkId}] Verification successful:`, response.data);
      
      // Update user data from verification response
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAuthChecked(true);
      
      // Store user in localStorage for immediate access on page reload
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      
      // If we got here, auth is valid - no need for fallback checks
      authSucceeded = true;
      setLoading(false);
      return;
    } catch (error) {
      console.log(`[Auth:${checkId}] Verification failed:`, error.response?.status);
      // Fall back to token-based auth if verification fails
    }
    
    // If verification failed, try token auth if we have a token (fallback method)
    const storedToken = localStorage.getItem('auth_token');
    if (!authSucceeded && storedToken) {
      try {
        console.log(`[Auth:${checkId}] Attempting token-based authentication`);
        const response = await axiosInstance.get('/auth/user/', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        console.log(`[Auth:${checkId}] Token authentication successful`);
        
        // Store user in localStorage as well for immediate access on page reload
        localStorage.setItem('auth_user', JSON.stringify(response.data));
        
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthChecked(true);
        setUsingTokenFallback(true); // Ensure we're using token auth since it worked
        authSucceeded = true;
        setLoading(false);
        return;
      } catch (error) {
        console.error(`[Auth:${checkId}] Token authentication failed:`, error.response?.status);
      }
    }
    
    // If verification and token auth failed, try cookie authentication
    if (!authSucceeded) {
      try {
        console.log(`[Auth:${checkId}] Attempting cookie-based authentication`);
        const response = await axiosInstance.get('/auth/user/');
        console.log(`[Auth:${checkId}] Cookie authentication successful`);
        
        // Store user in localStorage as well for immediate access on page reload
        localStorage.setItem('auth_user', JSON.stringify(response.data));
        
        setUser(response.data);
        setIsAuthenticated(true);
        setAuthChecked(true);
        setUsingTokenFallback(false);
        authSucceeded = true;
        setLoading(false);
        return;
      } catch (error) {
        console.log(`[Auth:${checkId}] Cookie authentication failed:`, error.response?.status);
      }
    }
    
    // If all primary methods failed but we were previously authenticated,
    // this might be a temporary network issue. Try once more after a delay.
    if (!authSucceeded && wasAuthenticated && previousUser) {
      console.log(`[Auth:${checkId}] Was authenticated before, trying one more time after delay`);
      try {
        // Wait a moment and try the verification endpoint one more time
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axiosInstance.get('/auth/verify/');
        
        console.log(`[Auth:${checkId}] Retry verification successful`);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setAuthChecked(true);
        setLoading(false);
        return;
      } catch (finalError) {
        console.error(`[Auth:${checkId}] Final authentication attempt failed`);
      }
    }
    
    // All attempts failed - clear auth state
    if (!authSucceeded) {
      console.log(`[Auth:${checkId}] All authentication methods failed, clearing auth state`);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      // Only redirect if explicitly requested and on a protected route
      if (shouldRedirect && !isPublicPath(currentPath)) {
        console.log(`[Auth:${checkId}] Redirecting to login due to auth failure on protected route`);
        window.location.href = '/login?msg=Please log in to continue';
      }
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      // First, ensure we're not already in an authentication process
      if (localStorage.getItem('auth_refreshing') === 'true') {
        console.warn('[Auth] Another authentication process is in progress, waiting...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for it to complete
        if (localStorage.getItem('auth_refreshing') === 'true') {
          localStorage.removeItem('auth_refreshing'); // Clear stuck flag
          console.warn('[Auth] Cleared stuck auth_refreshing flag');
        }
      }
      
      // Set a flag to prevent concurrent auth operations
      localStorage.setItem('auth_refreshing', 'true');
      
      // Clear URL params to avoid issues during login redirects
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('msg')) {
          url.searchParams.delete('msg');
          window.history.replaceState({}, document.title, url.toString());
          console.log('[Auth] Cleared msg parameter from URL to avoid login issues');
        }
      } catch (e) {
        console.error('[Auth] Error clearing URL params:', e);
      }
      
      // Reset any previous auth state before login attempt
      // This helps prevent conflicts between old and new auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('last_auth_time');
      localStorage.removeItem('last_token_refresh');
      
      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(false);
      
      // Clear all cookies to start with a clean slate
      console.log('[Auth] Clearing cookies before login attempt');
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie;
        if (name !== 'csrftoken') { // Preserve CSRF token
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        }
      }
      
      // Wait a moment for cookies to clear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setLoading(true);
  console.log('[Auth] Attempting login with username/email:', email);
      
      // Ensure we get a fresh CSRF token before login
      try {
        await axiosInstance.get('/auth/csrf/');
        console.log('[Auth] Refreshed CSRF token before login');
      } catch (e) {
        console.warn('[Auth] Could not refresh CSRF token before login');
      }
      
      // Wait for CSRF token to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // For better reliability, always request both cookie and token authentication
      // This ensures we have a fallback regardless of browser settings
      
      // Determine if login is using email or username
      const isEmail = email.includes('@');
      const loginData = isEmail 
        ? { email, password, include_token: true }
        : { username: email, password, include_token: true };
      
      console.log('[Auth] Login request data:', { ...loginData, password: '***' });
      
      const response = await axiosInstance.post('/auth/login/', loginData);
      
      console.log('[Auth] Login response:', response.data);
      
      if (!response.data?.user) {
        throw new Error('Invalid response from server: missing user data');
      }
      
      // Wait a moment for cookies to be set by the browser
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('[Auth] Cookies after login:', document.cookie);
      
      // Store user data in memory
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAuthChecked(true);
      
      // ALWAYS store user and token data in localStorage for persistence across page loads
      // This is critical for maintaining auth state during navigation
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      if (response.data.token) {
        console.log('[Auth] Storing authentication token in localStorage');
        localStorage.setItem('auth_token', response.data.token);
      } else {
        console.warn('[Auth] No token in response, will rely on cookie-based auth');
      }
      
      // Record login timestamp
      localStorage.setItem('last_auth_time', Date.now().toString());
      
      // Clear authentication processing flag
      localStorage.removeItem('auth_refreshing');
      
      // Attempt to verify that authentication is working before redirecting
      try {
        console.log('[Auth] Verifying authentication works...');
        // Make a test request to confirm authentication works
        const userResponse = await axiosInstance.get('/auth/user/');
        console.log('[Auth] Authentication verification successful:', userResponse.data);
        
        // If verification returned different user data, update what we have
        if (JSON.stringify(userResponse.data) !== JSON.stringify(response.data.user)) {
          console.log('[Auth] Updating user data from verification response');
          setUser(userResponse.data);
          localStorage.setItem('auth_user', JSON.stringify(userResponse.data));
        }
        
        // If we got here, authentication works! Return the response
        console.log('[Auth] Authentication successful');
        
        // No redirect here - let the Login/Register components handle the redirect
        return response.data;
      } catch (verifyError) {
        console.error('[Auth] Authentication verification failed:', verifyError);
        
        // If cookie-based auth failed but we have a token, we can still use that
        if (response.data.token) {
          console.log('[Auth] Cookie auth failed but token is available, using token fallback');
          setUsingTokenFallback(true);
          
          // No need to retry login since we already have the token
          // Just redirect the user
          setTimeout(() => {
            const destination = (response.data.user.role === 'superuser_admin' || response.data.user.role === 'admin')
              ? '/admin/dashboard'
              : '/courses';
            
            window.location.replace(destination);
          }, 100);
          
          return response.data;
        } else {
          // If we don't have a token and cookie auth failed, we have a real problem
          setIsAuthenticated(false);
          throw new Error('Authentication verification failed. Your browser may be blocking cookies.');
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('[Auth] Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (email, password, username = '') => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/register/', {
        username: username || email.split('@')[0],
        email,
        password,
        password2: password,
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Store user in localStorage
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      // Record login timestamp
      localStorage.setItem('last_auth_time', Date.now().toString());
      
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    // Set flag to prevent concurrent auth operations and avoid race conditions
    localStorage.setItem('auth_refreshing', 'true');
    
    // To track the status of the logout operation
    let logoutSuccessful = false;
    
    // Always perform a full client-side logout regardless of server response
    const performClientSideLogout = () => {
      console.log('[Auth] Performing complete client-side logout');
      
      // Reset auth state first to prevent UI from showing authenticated content
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(false);
      setUsingTokenFallback(false);
      
      // Clear all storage (auth tokens and data)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('last_auth_time');
      localStorage.removeItem('last_token_refresh');
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Delete all cookies with different techniques to ensure complete removal
      const cookies = document.cookie.split(";");
      console.log('[Auth] Cookies before deletion:', document.cookie);
      
      // Specifically target known auth cookies first, including sessionid
      const authCookies = ['access_token', 'refresh_token', 'csrftoken', 'sessionid', 'access_token_expiry', 'refresh_token_expiry'];
      
      // First attempt: standard deletion with multiple paths and options
      authCookies.forEach(name => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=None;Secure`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
      });
      // Extra: try to clear sessionid with no domain for edge cases
      document.cookie = `sessionid=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      
      // Second attempt: thorough deletion for all cookies
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie;
        
        if (name === 'csrftoken') {
          // We may want to preserve CSRF token in some cases
          continue;
        }
        
        // Delete the cookie with various path/domain combinations to ensure it's gone
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=None;Secure`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
      }
      
      console.log('[Auth] Cookies after deletion:', document.cookie);
      console.log('[Auth] Client-side logout complete');
      
      // Mark logout as successful
      logoutSuccessful = true;
    };
    
    try {
      console.log('[Auth] Attempting server-side logout...');
      
      // Ensure we get a fresh CSRF token before logout
      try {
        await axiosInstance.get('/auth/csrf/');
      } catch (e) {
        console.log('[Auth] Could not refresh CSRF token, continuing with logout');
      }
      
      // Create a new axios instance just for logout to avoid interceptor issues
      const logoutInstance = axios.create({
        baseURL: '/api',
        timeout: 5000,
        withCredentials: true
      });
      
      // Add Authorization header if token exists
      const token = localStorage.getItem('auth_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // First do client-side logout to ensure UI is updated immediately
      performClientSideLogout();
      
      // Send logout request - use a short timeout to prevent long waits if server is down
      await logoutInstance.post('/auth/logout/', {}, { headers });
      console.log('[Auth] Server-side logout successful');
      
      // Wait a moment to ensure cookies are cleared by the browser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Perform client-side logout again to ensure all server-set cookies are cleared
      performClientSideLogout();
    } catch (error) {
      console.error('[Auth] Server-side logout error:', error);
      // Continue with client-side logout regardless of server response
      performClientSideLogout();
      
      // Wait a moment to ensure cookies are cleared by the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Double check auth state after logout
    if (!logoutSuccessful) {
      console.error('[Auth] Logout failed to complete successfully');
      performClientSideLogout(); // Try one more time
    }
    
    // Final check to ensure cookies and storage are cleared
    console.log('[Auth] Final check - LocalStorage:', {
      auth_token: localStorage.getItem('auth_token'),
      auth_user: localStorage.getItem('auth_user')
    });
    console.log('[Auth] Final check - Cookies:', document.cookie);
    
    // Clear auth_refreshing flag to allow new auth operations
    localStorage.removeItem('auth_refreshing');
    
    // Return promise - we don't redirect here as our Logout component will handle that
    return Promise.resolve();
  };

  const refreshToken = async (maxRetries = 2) => {
    console.log('[Auth] Starting token refresh process');
    let attempt = 0;
    
    // Track last refresh to prevent rapid consecutive attempts
    const now = new Date().getTime();
    const lastRefreshTime = parseInt(localStorage.getItem('last_token_refresh') || '0');
    const COOLDOWN_PERIOD = 30 * 1000; // 30 seconds
    
    if (now - lastRefreshTime < COOLDOWN_PERIOD) {
      console.log('[Auth] Token refresh on cooldown, skipping');
      return false;
    }
    
    while (attempt <= maxRetries) {
      try {
        console.log(`[Auth] Token refresh attempt ${attempt + 1}/${maxRetries + 1}`);
        const response = await axiosInstance.post('/auth/refresh/');
        console.log('[Auth] Token refreshed successfully');
        
        // Store refresh timestamp
        localStorage.setItem('last_token_refresh', now.toString());
        
        // Store token for fallback auth if provided in response
        if (response.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        
        // Update authentication status but don't trigger redirect
        try {
          const userResponse = await axiosInstance.get('/auth/user/');
          setUser(userResponse.data);
          setIsAuthenticated(true);
          
          // Store user data for quick access and offline recovery
          localStorage.setItem('auth_user', JSON.stringify(userResponse.data));
          
          return true;
        } catch (userError) {
          // If user info fails after token refresh, something is wrong
          console.error('[Auth] Failed to get user after token refresh:', userError.response?.status);
          
          // Don't clear auth state right away - this might be a temporary network issue
          if (attempt === maxRetries) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error(`[Auth] Token refresh attempt ${attempt + 1} failed:`, error.response?.status);
        
        // Only clear auth state on final attempt
        if (attempt === maxRetries) {
          console.error('[Auth] All token refresh attempts failed');
          setUser(null);
          setIsAuthenticated(false);
          return false;
        }
        
        // Exponential backoff before retry
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[Auth] Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
      
      attempt++;
    }
    
    return false;
  };

  // Set up automatic token refresh
  useEffect(() => {
    // Skip ANY token refresh or auth checking on login/register pages
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') {
      console.log('[Auth] On authentication page, skipping token refresh setup');
      return;
    }
    
    if (!isAuthenticated) return;
    
    console.log('[Auth] Setting up automatic token refresh timer');
    
    // Helper to determine if token needs refresh
    const needsRefresh = () => {
      // Check when token was last refreshed (default to 0 if not set)
      const lastRefreshStr = localStorage.getItem('last_token_refresh');
      if (!lastRefreshStr) return true; // Refresh if no timestamp exists
      
      const lastRefresh = parseInt(lastRefreshStr);
      const now = new Date().getTime();
      
      // Calculate time since last refresh in hours
      const hoursSinceRefresh = (now - lastRefresh) / (1000 * 60 * 60);
      
      // Refresh if it's been more than 5 hours (safe margin before 6-hour expiry)
      return hoursSinceRefresh >= 5;
    };
    
    // Function to perform token refresh if needed
    const checkAndRefreshToken = async () => {
      if (needsRefresh()) {
        console.log('[Auth] Token may be expiring soon, refreshing proactively');
        await refreshToken();
      }
    };
    
    // Immediately check if we need to refresh
    checkAndRefreshToken();
    
    // Set up interval to check for token refresh - every hour
    const refreshInterval = setInterval(checkAndRefreshToken, 60 * 60 * 1000);
    
    // Also refresh when user returns to the app (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Auth] User returned to app, checking token');
        checkAndRefreshToken();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);
  
  const value = {
    user,
    loading,
    isAuthenticated,
    isSignedIn: isAuthenticated,
    isLoaded: !loading,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
