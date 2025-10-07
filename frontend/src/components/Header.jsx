import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// ...existing code...
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
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-github-lightText dark:text-github-darkText">
                EduConnect
              </Link>
            </div>
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
                    <span className="inline-block w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-2">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-white">{user?.username}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-github-darkSecondary rounded-lg shadow-lg border border-github-lightBorder dark:border-github-darkBorder z-50">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Profile</Link>
                      <Link to="/settings" className="block px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Settings</Link>
                      {isAdmin && <Link to="/admin" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Admin Dashboard</Link>}
                      <Link to="/logout" className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Logout</Link>
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
