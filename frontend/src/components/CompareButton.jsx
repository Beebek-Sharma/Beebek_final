import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const CompareButton = ({ courseId }) => {
  const handleCompare = () => {
    const comparedCourses = JSON.parse(localStorage.getItem('comparedCourses') || '[]');
    if (!comparedCourses.includes(courseId)) {
      comparedCourses.push(courseId);
      localStorage.setItem('comparedCourses', JSON.stringify(comparedCourses));
    }
  };

  return (
    <motion.button
      onClick={handleCompare}
      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-github-darkBorder text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-github-darkText bg-white dark:bg-github-dark hover:bg-gray-50 dark:hover:bg-github-darkAccent transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FiPlus className="w-4 h-4 mr-1" />
      Compare
    </motion.button>
  );
};

export default CompareButton;