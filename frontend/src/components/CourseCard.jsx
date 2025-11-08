import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiClock, FiDollarSign, FiAward } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white/40 dark:bg-gray-800/40 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-white/30 dark:border-gray-700/30"
    >
      <Link to={`/courses/${course.id}`} className="block">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-sky-500 to-cyan-600 dark:from-sky-600 dark:to-cyan-700 p-6">
          <div className="flex items-center text-white mb-2">
            <FiBook className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium opacity-90">
              {course.university_name || 'Course'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {course.name}
          </h3>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Description */}
          {course.description && (
            <p className="text-gray-600 dark:text-github-darkTextSecondary text-sm mb-4 line-clamp-3">
              {course.description}
            </p>
          )}
          
          {/* Course Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Duration */}
            {course.duration && (
              <div className="flex items-center text-gray-700 dark:text-github-darkText">
                <FiClock className="w-4 h-4 mr-2 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-github-darkTextSecondary">Duration</p>
                  <p className="text-sm font-semibold">{course.duration}</p>
                </div>
              </div>
            )}
            
            {/* Fees */}
            {course.fees && (
              <div className="flex items-center text-gray-700 dark:text-github-darkText">
                <FiDollarSign className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-github-darkTextSecondary">Fees</p>
                  <p className="text-sm font-semibold">{course.fees}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Level Badge */}
          {course.level && (
            <div className="flex items-center pt-4 border-t border-gray-200 dark:border-github-darkBorder">
              <FiAward className="w-4 h-4 mr-2 text-amber-500" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                {course.level}
              </span>
            </div>
          )}
          
          {/* View Details Button */}
          <div className="mt-4">
            <span className="text-sky-600 dark:text-sky-400 text-sm font-medium hover:underline">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
