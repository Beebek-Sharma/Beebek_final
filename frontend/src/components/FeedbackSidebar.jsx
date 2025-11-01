import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FeedbackSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      className="p-6 rounded-xl shadow-md 
                               bg-github-lightAccent dark:bg-github-darkAccent 
                               text-github-lightText dark:text-github-darkText 
                               transition-colors duration-300" style={{ transform: "none" }}
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
            {recentFeedbacks.map(fb => {
              const isAdmin = user?.role === 'admin' || user?.role === 'superuser_admin';
              
              return (
                <li
                  key={fb.id}
                  className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300"
                  style={{ transform: "none" }}
                >
                  <button
                    onClick={() => navigate(isAdmin ? `/admin/feedback/${fb.id}` : `/feedback`)}
                    className="font-medium text-base mb-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded px-1"
                  >
                    {fb.user?.username
                      ? `@${fb.user.username}`
                      : fb.user_name
                        ? `@${fb.user_name}`
                        : fb.username
                          ? `@${fb.username}`
                          : 'User'}
                  </button>
                  <div className="text-lg font-bold mb-1">{fb.subject}</div>
                  {fb.responses && fb.responses.length > 0 && (
                    <div className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900 rounded px-2 py-1 inline-block mt-1">Admin: {fb.responses[0].message}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div>
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Popular Feedbacks</h4>
        {popularFeedbacks.length === 0 ? (
          <p className="text-gray-500 text-sm">No popular feedbacks yet.</p>
        ) : (
          <ul className="space-y-3">
            {popularFeedbacks.map(fb => {
              const isAdmin = user?.role === 'admin' || user?.role === 'superuser_admin';
              
              return (
                <li
                  key={fb.id}
                  className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300"
                  style={{ transform: "none" }}
                >
                  <button
                    onClick={() => navigate(isAdmin ? `/admin/feedback` : `/feedback`)}
                    className="font-medium text-lg mb-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded px-1 transition-colors"
                  >
                    {fb.issue_title}
                  </button>
                  <div className="text-base opacity-80 mb-1">{fb.description}</div>
                  <div className="text-xs text-orange-500 dark:text-orange-400">Reported by {fb.count} users</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackSidebar;