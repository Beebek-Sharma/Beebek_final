import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import ThemeToggle from './ThemeToggle';
import { FiMenu } from 'react-icons/fi';

export default function Header({ toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 w-full bg-white dark:bg-github-dark z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Section: Menu Toggle + Logo */}
          <div className="flex items-center flex-shrink-0 space-x-4">
            {/* Menu Toggle Button - Medium.com style */}
            <motion.button
              id="mobile-menu-button"
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-700 dark:text-github-darkText hover:bg-gray-100 dark:hover:bg-github-darkAccent focus:outline-none"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FiMenu className="h-6 w-6" />
            </motion.button>

            <div className="flex items-center">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  EduConnect
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:block max-w-md flex-1 mx-6">
            <SearchBar />
          </div>

          {/* Right Section: Theme Toggle + Notification + User */}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <ThemeToggle />
            </motion.div>
            <SignedIn>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <NotificationBell />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <UserButton afterSignOutUrl="/" />
              </motion.div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <motion.button
                    className="px-3 py-2 border border-gray-300 text-sm rounded text-gray-700 bg-white hover:bg-gray-50 dark:bg-github-darkAccent dark:text-gray-200 dark:border-github-darkBorder transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <motion.button
                    className="px-3 py-2 text-sm rounded text-white bg-primary-600 hover:bg-primary-700 dark:bg-github-darkButton dark:hover:opacity-90 transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register
                  </motion.button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-github-dark shadow-md overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="px-4 pt-2 pb-3"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SearchBar />
            </motion.div>
            <nav className="px-2 pb-3 space-y-1">
              {['Home', 'Universities', 'Courses', 'Compare'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={item === 'Home' ? '/' : item === 'Compare' ? '/compare-courses' : `/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-github-darkAccent transition-all duration-200 rounded-md"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-github-darkBorder">
            <SignedIn>
              <div className="flex items-center px-4 space-x-3">
                <UserButton afterSignOutUrl="/" />
                <UserRoleIndicator />
                <NotificationBell />
              </div>
              <div className="mt-3 space-y-1">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Admin Panel</Link>
                )}
                <SignOutButton>
                  <button className="w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Logout</button>
                </SignOutButton>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="mt-3 space-y-1 px-4">
                <SignInButton mode="modal">
                  <button className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-github-darkAccent">Register</button>
                </SignUpButton>
              </div>
            </SignedOut>
            <div className="mt-3 px-4 flex items-center">
              <span className="text-gray-600 dark:text-gray-300 mr-2">Toggle Theme:</span>
              <ThemeToggle />
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
