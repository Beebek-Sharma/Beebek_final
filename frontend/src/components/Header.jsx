import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserRoleIndicator from './UserRoleIndicator';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { FiMenu } from 'react-icons/fi';

export default function Header({ toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const { user, isSignedIn, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'superuser_admin';

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-github-lightSecondary dark:bg-github-darkSecondary shadow-md z-50 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Menu Toggle + Logo */}
          <div className="flex items-center flex-shrink-0 space-x-4">
            <button
              id="mobile-menu-button"
              onClick={toggleSidebar}
              className="p-2 rounded-full text-github-lightText dark:text-github-darkText hover:bg-github-lightAccent dark:hover:bg-github-darkAccent focus:outline-none"
              aria-label="Toggle menu"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <img src="/app-logo.png" alt="App Logo" className="h-7 w-7 rounded-md" style={{marginRight: '4px'}} />
              <span className="text-2xl font-bold text-github-lightText dark:text-github-darkText">EduConnect</span>
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
            <div className="relative">
              {isSignedIn ? (
                <>
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center focus:outline-none">
                    {/* Only show avatar/profile picture */}
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className="inline-block w-8 h-8 rounded-full object-cover border-2 border-primary-600" />
                    ) : (
                      <span className="inline-block w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-72 max-h-[80vh] overflow-y-auto bg-white/60 dark:bg-github-darkSecondary/60 backdrop-blur-md rounded-xl shadow-lg border border-github-lightBorder dark:border-github-darkBorder z-50">
                      <div className="flex flex-col items-center py-6 px-6 border-b border-gray-100 dark:border-github-darkBorder">
                        {user?.profile_picture ? (
                          <img src={user.profile_picture} alt="Profile" className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-primary-600" />
                        ) : (
                          <span className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mb-2 text-2xl">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                        <div className="font-semibold text-lg text-gray-900 dark:text-white">{user?.full_name || user?.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user?.email}</div>
                        <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-2">View profile</Link>
                      </div>
                      <div className="py-2 border-b border-gray-100 dark:border-github-darkBorder">
                        <button onClick={() => { setShowProfileMenu(false); navigate('/settings'); }} className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent text-left">
                          <span className="mr-2">⚙️</span> Settings
                        </button>
                        {user?.role === 'admin' || user?.role === 'superuser_admin' ? (
                          <button onClick={() => { setShowProfileMenu(false); navigate('/admin'); }} className="flex items-center w-full px-6 py-3 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-github-darkAccent text-left">
                            <span className="mr-2">🛡️</span> Admin
                          </button>
                        ) : null}
                        <button onClick={() => { setShowProfileMenu(false); navigate('/help'); }} className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent text-left">
                          <span className="mr-2">❓</span> Help
                        </button>
                      </div>
                      <div className="py-2 border-b border-gray-100 dark:border-github-darkBorder">
                        <button onClick={() => { setShowProfileMenu(false); navigate('/membership'); }} className="flex items-center w-full px-6 py-3 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-github-darkAccent text-left">
                          <span className="mr-2">⭐</span> Become a member
                        </button>
                        <button onClick={() => { setShowProfileMenu(false); navigate('/partner-program'); }} className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent text-left">
                          Apply to the Partner Program
                        </button>
                      </div>
                      <div className="py-2">
                        <button onClick={logout} className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-github-darkAccent text-left">
                          Sign out
                        </button>
                        <div className="px-6 py-2 text-xs text-gray-500 dark:text-gray-400">{user?.email && `${user.email.replace(/(.{2}).+(@.+)/, '$1********$2')}`}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm rounded-lg text-primary-600 bg-white dark:bg-github-darkButton border border-primary-600 dark:border-github-darkBorder hover:bg-primary-50 dark:hover:opacity-90 font-medium transition-all duration-200">Login</Link>
                  <Link to="/register" className="px-4 py-2 text-sm rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-github-darkButton dark:hover:opacity-90 font-medium transition-all duration-200 ml-2">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-github-dark shadow-md">
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
    </header>
  );
}
