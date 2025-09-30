import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([]);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-github-darkText hover:text-gray-900 dark:hover:text-white focus:outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-github-darkSecondary rounded-lg shadow-lg border border-gray-200 dark:border-github-darkBorder z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-github-darkText mb-3">
                Notifications
              </h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-github-darkTextSecondary text-center py-4">
                  No new notifications
                </p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-github-darkAccent rounded-lg"
                    >
                      <p className="text-sm text-gray-900 dark:text-github-darkText">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-github-darkTextSecondary mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;