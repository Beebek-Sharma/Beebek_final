import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiBook,
  FiGlobe,
  FiLayout,
  FiInfo,
  FiMail,
  FiUser,
  FiSettings,
  FiMessageSquare,
  FiBookOpen,
  FiUsers,
  FiStar,
  FiHelpCircle,
  FiLogIn,
  FiUserPlus,
  FiGrid
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, isSignedIn } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superuser_admin';

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/universities', label: 'Universities', icon: FiGlobe },
    { path: '/courses', label: 'Courses', icon: FiBookOpen },
    { path: '/compare-courses', label: 'Compare', icon: FiLayout },
    { path: '/about', label: 'About', icon: FiInfo },
    { path: '/contact', label: 'Contact', icon: FiMail },
  ];

  const authenticatedItems = [
    { path: '/profile', label: 'Profile', icon: FiUser },
    { path: '/settings', label: 'Settings', icon: FiSettings },
    { 
      path: isAdmin ? '/admin/feedback' : '/feedback', 
      label: 'Feedbacks', 
      icon: FiMessageSquare 
    },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: FiGrid }] : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 h-full w-72 bg-gradient-to-br from-white to-gray-50 dark:from-github-darkSecondary dark:to-github-darkAccent shadow-2xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto no-scrollbar z-50"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-6">
              {/* Logo/Brand */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent"
                >
                  EduConnect
                </Link>
              </motion.div>

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
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 shadow-sm'
                            : 'text-gray-700 dark:text-github-darkText hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-github-darkAccent dark:hover:to-github-darkAccent/50'
                        }`}
                      >
                        {/* Hover gradient effect */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/50 to-primary-50/0 dark:from-primary-900/0 dark:via-primary-900/20 dark:to-primary-900/0"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                        
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Icon className={`w-5 h-5 mr-3 relative z-10 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-github-darkTextSecondary group-hover:text-primary-600 dark:group-hover:text-primary-400'}`} />
                        </motion.div>
                        <span className="font-medium relative z-10">{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="ml-auto w-1.5 h-8 bg-gradient-to-b from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 rounded-full shadow-lg"
                            layoutId="activeIndicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {isSignedIn ? (
                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.p
                    className="text-xs font-semibold bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-300 bg-clip-text text-transparent uppercase tracking-wider mb-3 px-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    My Account
                  </motion.p>
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
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                              isActive
                                ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 shadow-sm'
                                : 'text-gray-700 dark:text-github-darkText hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-github-darkAccent dark:hover:to-github-darkAccent/50'
                            }`}
                          >
                            {/* Hover gradient effect */}
                            {!isActive && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/50 to-primary-50/0 dark:from-primary-900/0 dark:via-primary-900/20 dark:to-primary-900/0"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.5 }}
                              />
                            )}
                            
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <Icon className={`w-5 h-5 mr-3 relative z-10 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-github-darkTextSecondary group-hover:text-primary-600 dark:group-hover:text-primary-400'}`} />
                            </motion.div>
                            <span className="font-medium relative z-10">{item.label}</span>
                            {isActive && (
                              <motion.div
                                className="ml-auto w-1.5 h-8 bg-gradient-to-b from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 rounded-full shadow-lg"
                                layoutId="accountActiveIndicator"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </motion.div>
              ) : (
                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <motion.button
                      className="w-full px-4 py-3 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FiLogIn className="w-5 h-5 mr-2" />
                      </motion.div>
                      Sign In
                    </motion.button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <motion.button
                      className="w-full px-4 py-3 flex items-center justify-center rounded-xl border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FiUserPlus className="w-5 h-5 mr-2" />
                      </motion.div>
                      Sign Up
                    </motion.button>
                  </Link>
                </motion.div>
              )}

              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
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
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;