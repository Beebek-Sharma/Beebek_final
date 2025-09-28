import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';
import UserRoleIndicator from './UserRoleIndicator';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const isSignedIn = !!user;
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex flex-grow items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                EduConnect
              </Link>
            </div>   
        
            {/* Search Bar - Desktop */}
            <div className="hidden md:block mx-4 flex-grow max-w-md mt-4">
              <SearchBar />
            </div>
          </div>
          
          {/* Right Side Items - Desktop */}
          <div className="hidden md:flex md:items-center md:pl-6 space-x-4">
            <SignedIn>
              {/* Notification Bell */}
              <NotificationBell />
              <div className="ml-6">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    Register
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Search Bar - Mobile */}
          <div className="px-2 pt-2 pb-3">
            <SearchBar />
          </div>
          
          {/* Navigation Links - Mobile */}
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/universities" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Universities
            </Link>
            <Link 
              to="/courses" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              to="/compare-courses" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Compare
            </Link>
          </nav>
          
          {/* User Menu - Mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <SignedIn>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div className="ml-3">
                  <UserRoleIndicator />
                </div>
                <div className="ml-4">
                  <NotificationBell />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <SignOutButton>
                  <button className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="mt-3 space-y-1 px-2">
                <SignInButton mode="modal">
                  <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    Register
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
