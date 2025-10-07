import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

const FeedbackSidebar = () => {
  return (
    <motion.div
      className="bg-white dark:bg-github-darkSecondary rounded-lg shadow-lg border border-gray-200 dark:border-github-darkBorder p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <FiMessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-github-darkText">Feedback</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-github-darkText mb-4">
        Have suggestions or found an issue? We'd love to hear from you!
      </p>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/feedback"
          className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-all duration-200"
        >
          Submit Feedback
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackSidebar;