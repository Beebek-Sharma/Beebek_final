import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBook, FiGlobe, FiLayout, FiInfo, FiMail, FiUser, FiSettings } from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, isSignedIn } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superuser_admin';

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/universities', label: 'Universities', icon: FiGlobe },
    { path: '/courses', label: 'Courses', icon: FiBook },
    { path: '/compare-courses', label: 'Compare', icon: FiLayout },
    { path: '/about', label: 'About', icon: FiInfo },
    { path: '/contact', label: 'Contact', icon: FiMail },
  ];

  const authenticatedItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiUser },
  ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: FiSettings }] : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="h-full bg-white dark:bg-github-darkSecondary shadow-xl border-r border-gray-200 dark:border-github-darkBorder overflow-y-auto no-scrollbar"
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-6">

            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-primary-50 dark:bg-github-darkAccent text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-github-darkText hover:bg-gray-100 dark:hover:bg-github-darkAccent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-github-darkTextSecondary'}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-full"
                          layoutId="activeIndicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {isSignedIn ? (
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 dark:border-github-darkBorder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-semibold text-gray-500 dark:text-github-darkTextSecondary uppercase tracking-wider mb-3">
                  My Account
                </p>
                <nav className="space-y-2">
                  {authenticatedItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-50 dark:bg-github-darkAccent text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-github-darkText hover:bg-gray-100 dark:hover:bg-github-darkAccent'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-github-darkTextSecondary'}`} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </motion.div>
            ) : (
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 dark:border-github-darkBorder space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <motion.button
                    className="w-full px-4 py-3 border border-gray-300 dark:border-github-darkBorder text-sm rounded-lg text-gray-700 dark:text-github-darkText bg-white dark:bg-github-dark hover:bg-gray-50 dark:hover:bg-github-darkAccent transition-all duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <motion.button
                    className="w-full px-4 py-3 text-sm rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-github-darkButton dark:hover:opacity-90 transition-all duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </motion.div>
            )}

            <motion.div
              className="mt-8 pt-6 border-t border-gray-200 dark:border-github-darkBorder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs text-gray-500 dark:text-github-darkTextSecondary text-center">
                &copy; {new Date().getFullYear()} EduConnect
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;