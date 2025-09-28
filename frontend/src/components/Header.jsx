import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from '@clerk/clerk-react';
import UserRoleIndicator from './UserRoleIndicator';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <header className="bg-white shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Left Section: Hamburger + Logo */}
          <div className="flex items-center flex-shrink-0 space-x-4">
            {/* Hamburger Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                {!isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>

            <div className="flex items-center">
              <div className="flex items-center ml-6">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  EduConnect
                </Link>
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:block mx-4 flex-grow max-w-md mt-4">
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Right Section: Notification + User */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              <NotificationBell />
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <button className="px-3 py-2 border border-gray-300 text-sm rounded text-gray-700 bg-white hover:bg-gray-50">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-3 py-2 text-sm rounded text-white bg-primary-600 hover:bg-primary-700">
                    Register
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-2 pb-3">
            <SearchBar />
          </div>
          <nav className="px-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Home</Link>
            <Link to="/universities" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Universities</Link>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Courses</Link>
            <Link to="/compare-courses" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Compare</Link>
          </nav>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <SignedIn>
              <div className="flex items-center px-4 space-x-3">
                <UserButton afterSignOutUrl="/" />
                <UserRoleIndicator />
                <NotificationBell />
              </div>
              <div className="mt-3 space-y-1">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Admin Panel</Link>
                )}
                <SignOutButton>
                  <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100">Logout</button>
                </SignOutButton>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="mt-3 space-y-1 px-4">
                <SignInButton mode="modal">
                  <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100">Login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100">Register</button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
