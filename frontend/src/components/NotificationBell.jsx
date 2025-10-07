import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useAuth();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!isLoaded || !user || !user?.id) return;  // Ensure user is properly authenticated
    setLoading(true);
    try {
      const res = await axios.get('/notifications/');
      setNotifications(res.data);
    } catch (err) {
      // Optionally handle error
      console.log('[NotificationBell] Failed to fetch notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll notifications every 30s
  useEffect(() => {
    if (!isLoaded || !user || !user?.id) return;  // Ensure user is properly authenticated
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLoaded, user]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.post(`/notifications/${id}/mark-read/`);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {}
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 dark:text-github-darkText hover:text-gray-900 dark:hover:text-white focus:outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={!user}
      >
        <FiBell className="w-6 h-6" />
        {notifications.filter((n) => !n.is_read).length > 0 && (
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
              {loading ? (
                <p className="text-sm text-gray-500 dark:text-github-darkTextSecondary text-center py-4">Loading...</p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-github-darkTextSecondary text-center py-4">No new notifications</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 bg-gray-50 dark:bg-github-darkAccent rounded-lg ${!notification.is_read ? 'border-l-4 border-primary-500' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-github-darkText">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-github-darkTextSecondary mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                        </div>
                        {!notification.is_read && (
                          <button
                            className="ml-2 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded hover:bg-primary-200 dark:hover:bg-primary-800"
                            onClick={() => markAsRead(notification.id)}
                          >Mark as read</button>
                        )}
                      </div>
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