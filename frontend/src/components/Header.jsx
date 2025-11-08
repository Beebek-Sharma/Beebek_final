import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UserRoleIndicator from './UserRoleIndicator';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiSettings, FiHelpCircle, FiStar, FiUsers, FiLogOut } from 'react-icons/fi';

// Helper function to get the correct image URL
const getImageUrl = (url) => {
  if (!url) return null;
  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // For development, images should be proxied through Vite
  // The proxy is configured to forward /media requests to the backend
  return url;
};

export default function Header({ toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const { user, isSignedIn, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'superuser_admin';
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 w-full bg-white/40 dark:bg-github-darkSecondary/40 backdrop-blur-md shadow-lg z-50 transition-colors duration-300 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">{/* Left Section: Menu Toggle + Logo */}
          <div className="flex items-center flex-shrink-0 space-x-4">
            <motion.button
              id="mobile-menu-button"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all"
              aria-label="Toggle menu"
            >
              <FiMenu className="h-6 w-6" />
            </motion.button>
            <Link to="/" className="flex items-center space-x-2">
              <motion.img
                src="/app-logo.png"
                alt="EduConnect Logo"
                className="h-10 w-10 rounded-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                EduConnect
              </motion.span>
            </Link>
          </div>
          {/* Search Bar - Desktop */}
          <div className="hidden md:block max-w-md flex-1 mx-6">
            <SearchBar />
          </div>
          {/* Right Section: Theme Toggle + Notification + User */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="relative">
              <NotificationBell />
              {showBellDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-github-lightAccent dark:bg-github-darkSecondary rounded-lg shadow-lg border border-github-lightBorder dark:border-github-darkBorder z-50">
                  {!isSignedIn && (
                    <div className="p-4 text-center text-github-lightTextSecondary dark:text-github-darkTextSecondary">Sign in to view notifications.</div>
                  )}
                </div>
              )}
            </div>
            <div className="relative" ref={profileMenuRef}>
              {isSignedIn ? (
                <>
                  <motion.button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center focus:outline-none"
                  >
                    {/* Only show avatar/profile picture */}
                    {user?.profile_picture ? (
                      <img src={getImageUrl(user.profile_picture)} alt="Profile" className="inline-block w-9 h-9 rounded-full object-cover border-2 border-primary-600 shadow-md" />
                    ) : (
                      <span className="inline-block w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-bold shadow-md">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 max-h-[80vh] overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 z-50"
                      >
                        <div className="flex flex-col items-center py-6 px-6 border-b border-gray-100 dark:border-gray-800">
                          {user?.profile_picture ? (
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              src={getImageUrl(user.profile_picture)}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover mb-3 border-3 border-primary-600 shadow-lg"
                            />
                          ) : (
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center font-bold mb-3 text-3xl shadow-lg"
                            >
                              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </motion.span>
                          )}
                          <div className="font-bold text-lg text-gray-900 dark:text-white">{user?.full_name || user?.username}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user?.email}</div>
                          <Link to="/profile" className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
                            View profile
                          </Link>
                        </div>
                        <div className="py-2">
                          <motion.button
                            whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                            onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                            className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 text-left transition-all"
                          >
                            <FiSettings className="mr-3 text-gray-500 dark:text-gray-400" size={18} />
                            Settings
                          </motion.button>
                          {user?.role === 'admin' || user?.role === 'superuser_admin' ? (
                            <motion.button
                              whileHover={{ x: 5, backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
                              onClick={() => { setShowProfileMenu(false); navigate('/admin'); }}
                              className="flex items-center w-full px-6 py-3 text-sky-700 dark:text-sky-400 text-left transition-all"
                            >
                              <span className="mr-3 text-xl">🛡️</span>
                              Admin Dashboard
                            </motion.button>
                          ) : null}
                          <motion.button
                            whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                            onClick={() => { setShowProfileMenu(false); navigate('/help'); }}
                            className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 text-left transition-all"
                          >
                            <FiHelpCircle className="mr-3 text-gray-500 dark:text-gray-400" size={18} />
                            Help Center
                          </motion.button>
                        </div>
                        <div className="py-2 border-t border-gray-100 dark:border-gray-800">
                          <motion.button
                            whileHover={{ x: 5, backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                            onClick={() => { setShowProfileMenu(false); navigate('/become-member'); }}
                            className="flex items-center w-full px-6 py-3 text-yellow-700 dark:text-yellow-400 text-left transition-all"
                          >
                            <FiStar className="mr-3" size={18} />
                            Become a member
                          </motion.button>
                          <motion.button
                            whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                            onClick={() => { setShowProfileMenu(false); navigate('/partner-program'); }}
                            className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 text-left transition-all"
                          >
                            <FiUsers className="mr-3 text-gray-500 dark:text-gray-400" size={18} />
                            Partner Program
                          </motion.button>
                        </div>
                        <div className="py-2 border-t border-gray-100 dark:border-gray-800">
                          <motion.button
                            whileHover={{ x: 5, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                            onClick={logout}
                            className="flex items-center w-full px-6 py-3 text-red-600 dark:text-red-400 text-left transition-all font-medium"
                          >
                            <FiLogOut className="mr-3" size={18} />
                            Sign out
                          </motion.button>
                          <div className="px-6 py-2 text-xs text-gray-500 dark:text-gray-400">
                            {user?.email && `${user.email.replace(/(.{2}).+(@.+)/, '$1********$2')}`}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm rounded-lg text-primary-600 dark:text-primary-400 bg-white/40 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-800/50 font-medium transition-all duration-200"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-sm rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 font-medium transition-all duration-200 shadow-md"
                    >
                      Register
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/40 dark:bg-gray-800/40 shadow-md border-t border-white/30 dark:border-gray-700/30">
          <div className="px-4 pt-2 pb-3">
            <SearchBar />
          </div>
          <nav className="px-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Home</Link>
            <Link to="/universities" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Universities</Link>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Courses</Link>
            <Link to="/compare-courses" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Compare</Link>
          </nav>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-github-darkBorder">
            <div className="mt-3 px-4 flex items-center">
              <span className="text-gray-600 dark:text-gray-300 mr-2">Toggle Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
