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
  
  // Helper to determine if a path is a public path that doesn't require auth
  const isPublicPath = (path) => {
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
    return publicPaths.some(p => pathWithoutParams.startsWith(p)) || pathWithoutParams === '/';
  };

  // Helper to check for presence of session cookie
  const hasAuthCookie = () => {
    return document.cookie.split(';').some(c => c.trim().startsWith('sessionid='));
  };
  
  // Helper to check if we have authentication in any form (cookie or stored user)
  const hasAuthentication = () => {
    const hasCookie = hasAuthCookie();
    const hasStoredUser = !!localStorage.getItem('auth_user');
    
    console.log('[Auth] Authentication check:', { hasCookie, hasStoredUser });
    
    return hasCookie || hasStoredUser;
  };
  
  // First-time initialization effect to set up authentication
  useEffect(() => {
    console.log('[Auth] Application initializing, performing initial auth verification');

    const initializeAuth = async () => {
      const currentPath = window.location.pathname;

      // 1) Never run verification on auth pages
      if (currentPath === '/login' || currentPath === '/register') {
        console.log('[Auth] On login/register route, skipping initial auth check');
        setLoading(false);
        setAuthChecked(true);
        setIsAuthenticated(false);
        return;
      }

      // 2) Optimistic pre-load from storage to reduce UI flicker
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('[Auth] Pre-loaded user from storage (optimistic)');
        } catch (e) {
          console.warn('[Auth] Failed to parse stored user');
        }
      }

      // 3) Always verify once on first load (public or protected),
      //    so httpOnly cookies (sessionid/JWT) are recognized immediately after OAuth
      try {
          await checkAuth(false, false);
      } catch (error) {
        console.error('[Auth] Initial auth verification error:', error);
        // Small one-time retry after short delay to handle cookie propagation after OAuth redirect
        await new Promise(res => setTimeout(res, 500));
        try {
          console.log('[Auth] Retrying initial auth verification...');
            await checkAuth(false, false);
        } catch (e2) {
          console.warn('[Auth] Auth verification retry failed');
        }
      }
    };

    initializeAuth();
  }, []);

  const checkAuth = async (shouldRedirect = true) => {
    const checkId = Math.random().toString(36).substring(2, 8);
    console.log(`[Auth:${checkId}] Starting authentication check, shouldRedirect=${shouldRedirect}`);
    
    // Skip auth check on login/register pages
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') {
      console.log(`[Auth:${checkId}] On login/register page, skipping auth check`);
      setLoading(false);
      setAuthChecked(true);
      return;
    }
    
    // Skip check on public paths unless explicitly told to check
    if (isPublicPath(currentPath) && !shouldRedirect && !hasAuthentication()) {
      console.log(`[Auth:${checkId}] Skipping check on public path with no stored auth`);
      setLoading(false);
      setAuthChecked(true);
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    
    setLoading(true);
    
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
      
      setLoading(false);
      return;
    } catch (error) {
      console.log(`[Auth:${checkId}] Verification failed:`, error.response?.status);
      
      // Authentication failed - clear auth state
      console.log(`[Auth:${checkId}] Authentication failed, clearing auth state`);
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
      setLoading(true);
      console.log('[Auth] Attempting login with username/email:', email);
      
      // Ensure we get a fresh CSRF token before login
      try {
        await axiosInstance.get('/auth/csrf/');
        console.log('[Auth] Refreshed CSRF token before login');
      } catch (e) {
        console.warn('[Auth] Could not refresh CSRF token before login');
      }
      
      // Determine if login is using email or username
      const isEmail = email.includes('@');
      const loginData = isEmail 
        ? { email, password }
        : { username: email, password };
      
      console.log('[Auth] Login request data:', { ...loginData, password: '***' });
      
      const response = await axiosInstance.post('/auth/login/', loginData);
      
      console.log('[Auth] Login response:', response.data);
      
      if (!response.data?.user) {
        throw new Error('Invalid response from server: missing user data');
      }
      
      // Store user data in state
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAuthChecked(true);
      
      // Store user in localStorage for quick access on page reload
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      localStorage.setItem('last_auth_time', Date.now().toString());
      
      console.log('[Auth] Login successful');
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error('[Auth] Login error:', error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
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
            await checkAuth(false, true);
      localStorage.setItem('last_auth_time', Date.now().toString());
      
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
              await checkAuth(false, true);
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('[Auth] Starting logout process');
    
    // Reset auth state immediately for instant UI update
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(false);
    
    // Clear all local storage auth data
    localStorage.removeItem('auth_user');
    localStorage.removeItem('last_auth_time');
    
    // Clear session storage
    sessionStorage.clear();
    
    try {
      // Call backend logout endpoint to clear session
      await axiosInstance.post('/auth/logout/');
      console.log('[Auth] Server-side logout successful');
    } catch (error) {
      console.error('[Auth] Server-side logout error:', error);
      // Continue with client-side logout even if server fails
    }
    
    console.log('[Auth] Logout complete');
    return Promise.resolve();
  };

  // Function to refresh user data from the server
  const refreshUser = async () => {
    try {
      // Use /auth/me/ endpoint to always get latest profile info including bio
      const response = await axiosInstance.get('/auth/me/');
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('[Auth] Failed to refresh user data:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isSignedIn: isAuthenticated,
    isLoaded: !loading,
    login,
    register,
    logout,
    checkAuth,
    refreshUser,
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
