import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CourseCard = ({ course }) => {
  return (
    <motion.div
      className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg transition-all duration-300"
      whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-github-darkText">{course.name}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-github-darkText">{course.university_name}</p>
        <div className="mt-2 flex items-center">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {course.level}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-github-darkText">
            {course.duration}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-github-darkText line-clamp-3">
          {course.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-github-darkText">
            ${course.fees}
          </span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;