import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';
import UserRoleIndicator from './UserRoleIndicator';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const isSignedIn = !!user;
  // Example: Clerk user publicMetadata.role === 'admin'
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                EduConnect
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex">
              {/* Main navigation items */}
              <div className="flex space-x-8">
                <Link to="/" className="border-transparent text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/universities" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Universities
                </Link>
                <Link to="/courses" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Courses
                </Link>
                <Link to="/compare-courses" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Compare
                </Link>
              </div>
              
              {/* Spacer */}
              <div className="w-8"></div>
              
              {/* Secondary navigation items */}
              <div className="flex space-x-8">
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <SignedIn>
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center">
                  <UserRoleIndicator />
                  <span className="ml-1">{user?.username || user?.primaryEmailAddress?.emailAddress || 'Dashboard'}</span>
                </Link>
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
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          {/* Main navigation items */}
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Home
            </Link>
            <Link to="/universities" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Universities
            </Link>
            <Link to="/courses" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Courses
            </Link>
            <Link to="/compare-courses" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Compare
            </Link>
          </div>
          
          {/* Secondary navigation items */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <SignedIn>
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{user?.username?.charAt(0).toUpperCase() || user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.username || user?.primaryEmailAddress?.emailAddress}</div>
                    <UserRoleIndicator />
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin/feedback" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      Manage Feedback
                    </Link>
                  )}
                  <SignOutButton>
                    <button className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                      Logout
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="mt-3 space-y-1">
                <SignInButton mode="modal">
                  <button className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
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