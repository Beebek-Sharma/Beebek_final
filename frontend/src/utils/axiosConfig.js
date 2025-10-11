import axios from 'axios';

// Get backend URL from environment or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Prefer Vite proxy in dev to keep requests same-origin (so cookies behave consistently)
const useDevProxy = typeof window !== 'undefined' && /localhost:517(3|4)$/.test(window.location.host);

const axiosInstance = axios.create({
  baseURL: useDevProxy ? '/api' : `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Critical for cross-domain cookies
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Get CSRF token from cookie
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Request interceptor to add CSRF token and auth token if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    // Add CSRF token for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    // Only add Authorization header if explicitly requested via flag.
    // Default to cookie-based auth to prevent stale/invalid bearer from blocking session auth.
    const useBearer = localStorage.getItem('use_bearer_auth') === 'true';
    if (!config.headers['Authorization'] && useBearer) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('[Axios] Adding Authorization token to request (explicit mode)');
      }
    }
    
    console.log('[Axios] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
let isRefreshing = false;
let failedQueue = [];
let sessionExpired = false;
let authFailureCount = 0; // Track consecutive auth failures
const AUTH_MAX_RETRIES = 2; // Maximum number of consecutive auth retries

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Track auth request paths to avoid unnecessary token refresh attempts
const AUTH_PATHS = {
  refresh: '/auth/refresh/',
  login: '/auth/login/',
  register: '/auth/register/',
  logout: '/auth/logout/',
  user: '/auth/user/',
  csrf: '/auth/csrf/',
  verify: '/auth/verify/'
};

// Check if a URL is an auth endpoint where refresh shouldn't be attempted
const isAuthEndpoint = (url) => {
  return Object.values(AUTH_PATHS).some(path => url?.endsWith(path));
};

// Helper to determine if we should attempt a refresh
const shouldAttemptRefresh = (url) => {
  // Skip refresh for auth endpoints and check for refresh_token cookie
  if (isAuthEndpoint(url)) {
    return false;
  }
  
  // Check for existence of refresh token cookie before attempting refresh
  return hasCookie('refresh_token');
};

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response:', response.config.url, response.status);
    // Reset auth failure count on successful requests
    if (response.status === 200 && response.config.url?.includes('/auth/')) {
      authFailureCount = 0;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    
    console.error('[Axios] Error:', {
      url: error.config?.url,
      status,
      data: error.response?.data
    });
    
    // For auth endpoints or non-401 errors, don't attempt refresh
    if (isAuthEndpoint(originalRequest?.url) || status !== 401) {
      return Promise.reject(error);
    }
    
    // Special handling for rate limiting (429 status)
    if (error.response?.status === 429) {
      console.warn('[Axios] Rate limited!', error.response?.headers);
      
      // Check for Retry-After header
      const retryAfter = error.response?.headers?.['retry-after'];
      if (retryAfter) {
        const waitTime = parseInt(retryAfter) * 1000 || 5000;
        console.log(`[Axios] Will retry after ${waitTime}ms per server instructions`);
        
        // Wait and retry once
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('[Axios] Retrying rate-limited request');
            resolve(axiosInstance(originalRequest));
          }, waitTime);
        });
      }
    }
    
    // Handle 401 Unauthorized - try to refresh token, but only if we haven't exceeded retry limit
    if (!originalRequest._retry && authFailureCount < AUTH_MAX_RETRIES && shouldAttemptRefresh(originalRequest.url)) {
      console.log('[Axios] Attempting token refresh for:', originalRequest.url);
      
      // Increment auth failure counter
      authFailureCount++;
      
      // Set a cooldown between refresh attempts
      const now = new Date().getTime();
      const lastRefreshAttempt = parseInt(localStorage.getItem('last_refresh_attempt') || '0');
      const REFRESH_COOLDOWN = 10 * 1000; // 10 seconds
      
      if (now - lastRefreshAttempt < REFRESH_COOLDOWN) {
        console.log('[Axios] Token refresh on cooldown, will try again later');
        return Promise.reject(error);
      }
      
      // Record this attempt
      localStorage.setItem('last_refresh_attempt', now.toString());
      
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axiosInstance.post('/auth/refresh/');
        console.log('[Axios] Token refresh successful');
        authFailureCount = 0; // Reset counter on success
        isRefreshing = false;
        processQueue(null);
        
        // Get CSRF token for subsequent requests if needed
        await axiosInstance.get('/auth/csrf/');
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('[Axios] Token refresh failed:', refreshError);
        isRefreshing = false;
        processQueue(refreshError);
        
        // Only redirect if not on auth pages and we've reached the retry limit
        const isAuthPage = window.location.pathname.startsWith('/login') || 
                         window.location.pathname.startsWith('/register');
        
        if (!isAuthPage && !sessionExpired && authFailureCount >= AUTH_MAX_RETRIES) {
          console.log('[Axios] Auth retry limit reached, redirecting to login');
          sessionExpired = true;
          // No need for immediate redirect - let the UI handle this state
        }
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 403) {
      console.error('Forbidden - user does not have permission');
    }
    
    return Promise.reject(error);
  }
);

// Reset tracking variables on auth pages
if (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register')) {
  sessionExpired = false;
  authFailureCount = 0;
}

// Enhanced helper to debug cookies
const hasCookie = (name) => {
  const cookies = document.cookie.split(';');
  console.log(`[Cookie Check] Searching for ${name} in cookies:`, cookies);
  
  // Note: httpOnly cookies won't be visible via document.cookie
  // This can only check for non-httpOnly cookies
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    console.log(`[Cookie Check] Checking cookie: ${cookie}`);
    if (cookie.startsWith(name + '=')) {
      console.log(`[Cookie Check] Found ${name} cookie`);
      return true;
    }
  }
  
  // Special case for JWT auth: we can't see httpOnly cookies, but we can infer their presence
  // by making an authenticated request
  if (name === 'access_token' || name === 'refresh_token') {
    console.log(`[Cookie Check] Note: ${name} might be httpOnly and not visible to JavaScript`);
  }
  
  console.log(`[Cookie Check] ${name} cookie not found in document.cookie`);
  return false;
};

// Debug all cookies on page load
console.log('[Axios] All visible cookies on page load:', document.cookie);

// Test for httpOnly cookie presence
// Modified to be more cautious about making auth requests
const testAuthCookies = async () => {
  // First check if we're on login, register or logout page and ALWAYS skip auth checks
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/register' || currentPath === '/logout') {
    console.log('[Axios] On authentication page, NEVER testing auth cookies');
    return false;
  }
  
  // First check localStorage for token to avoid unnecessary API calls
  if (!localStorage.getItem('auth_token') && !localStorage.getItem('auth_user')) {
    console.log('[Axios] No auth tokens in localStorage, skipping cookie test');
    return false;
  }
  
  // Also check if we're currently in the middle of a login/logout operation
  if (localStorage.getItem('auth_refreshing') === 'true') {
    console.log('[Axios] Authentication operation in progress, skipping cookie test');
    return false;
  }
  
  try {
    console.log('[Axios] Testing for httpOnly auth cookies by making a test request...');
    const response = await axiosInstance.get('/auth/user/');
    console.log('[Axios] Auth cookies are present and working!', response.status);
    return true;
  } catch (error) {
    console.log('[Axios] No valid auth cookies detected', error.response?.status);
    return false;
  }
};

// Define public paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/about',
  '/contact',
  '/universities',
  '/courses',
  '/search',
  '/'
];

// Helper to check if current path is a public path
const isPublicPath = (path) => {
  return PUBLIC_PATHS.some(p => path.startsWith(p));
};

// Minimal initialization that avoids auth checks on public pages
const initializeApp = async () => {
  try {
    // Always get CSRF token - this is safe and doesn't cause redirect loops
    await axiosInstance.get('/auth/csrf/');
    console.log('[Axios] CSRF token fetched successfully');
    
    // Only attempt silent token refresh if:
    // 1. We're on a protected page (not login/register/etc.)
    // 2. We have auth data (token in localStorage)
    // 3. We're not in an SSR environment (window exists)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const needsAuth = !isPublicPath(currentPath);
    const hasStoredAuth = localStorage.getItem('auth_token') || localStorage.getItem('auth_user');
    
    if (needsAuth && hasStoredAuth) {
      console.log('[Axios] Protected route detected with stored auth data');
      // No need to actually make the request - AuthContext will handle this
      // Just reset the auth failure counter
      authFailureCount = 0;
    } else {
      console.log('[Axios] No auth needed for current route or no stored auth data available');
    }
  } catch (err) {
    console.warn('[Axios] Failed to initialize:', err);
    // Continue with app initialization regardless of errors
  }
};

// Run initialization
initializeApp();

export default axiosInstance;