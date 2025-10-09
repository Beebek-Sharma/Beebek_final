import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const FeedbackSidebar = () => {
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [popularFeedbacks, setPopularFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch recent feedbacks with admin responses (featured)
    axios.get('/api/featured-feedback/')
      .then(res => setRecentFeedbacks(res.data))
      .catch(() => setRecentFeedbacks([]));
    // Fetch popular feedbacks (commonly reported issues)
    axios.get('/api/feedbacks/popular?limit=3')
      .then(res => setPopularFeedbacks(res.data))
      .catch(() => setPopularFeedbacks([]));
  }, []);

  return (
    <motion.div
      className="bg-white dark:bg-github-dark rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary-600 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m10-4v4m0 0L12 3m5 3L12 3" />
        </svg>
        <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">Feedbacks</h3>
      </div>
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Recent Feedbacks (with Admin Response)</h4>
        {recentFeedbacks.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent feedbacks yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentFeedbacks.map(fb => (
              <li key={fb.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-github-darkAccent">
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  {fb.user?.username
                    ? `@${fb.user.username}`
                    : fb.user_name
                      ? `@${fb.user_name}`
                      : fb.username
                        ? `@${fb.username}`
                        : 'User'}:
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">{fb.subject}</div>
                {fb.responses && fb.responses.length > 0 && (
                  <div className="text-xs text-primary-600 dark:text-primary-400">Admin: {fb.responses[0].message}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Popular Feedbacks</h4>
        {popularFeedbacks.length === 0 ? (
          <p className="text-gray-500 text-sm">No popular feedbacks yet.</p>
        ) : (
          <ul className="space-y-3">
            {popularFeedbacks.map(fb => (
              <li key={fb.id} className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900">
                <div className="font-medium text-blue-700 dark:text-blue-300">{fb.issue_title}</div>
                <div className="text-gray-700 dark:text-blue-100 text-sm">{fb.description}</div>
                <div className="text-xs text-blue-500 dark:text-blue-400">Reported by {fb.count} users</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackSidebar;