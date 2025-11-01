import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiRefreshCw, FiSearch, FiBookOpen, FiGlobe } from 'react-icons/fi';
import UniversityCard from './UniversityCard';
import CourseCard from './CourseCard';

/**
 * SearchResults Component
 * 
 * Handles three distinct states:
 * 1. Loading - Shows spinner with "Searching..." text
 * 2. Error - Shows red error alert
 * 3. No Results - Shows "No results found" with helpful suggestions
 * 
 * Only one state is shown at a time based on props
 */
const SearchResults = ({ loading, error, results, query, activeTab }) => {
  // State 1: LOADING - Show spinner while searching
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="rounded-full h-20 w-20 border-4 border-primary-200 dark:border-primary-900"
          />
          <motion.div
            className="absolute top-0 rounded-full h-20 w-20 border-t-4 border-primary-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Searching...
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Finding the best matches for "{query}"
          </p>
        </motion.div>
      </div>
    );
  }

  // State 2: ERROR - Show error alert if search fails
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="my-12"
      >
        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-8 rounded-2xl shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                <FiAlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                Search Error
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
              >
                <FiRefreshCw className="mr-2" />
                Retry search
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Filter results based on active tab
  const getFilteredResults = () => {
    if (!results) return { universities: [], courses: [], total: 0 };
    
    switch (activeTab) {
      case 'universities':
        return {
          universities: results.universities || [],
          courses: [],
          total: (results.universities || []).length
        };
      case 'courses':
        return {
          universities: [],
          courses: results.courses || [],
          total: (results.courses || []).length
        };
      default:
        return {
          universities: results.universities || [],
          courses: results.courses || [],
          total: results.total || 0
        };
    }
  };

  const displayResults = getFilteredResults();
  const hasUniversities = displayResults.universities.length > 0;
  const hasCourses = displayResults.courses.length > 0;
  const hasAnyResults = hasUniversities || hasCourses;

  // State 3: NO RESULTS - Show helpful message if search returns empty
  if (!hasAnyResults && query) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-6"
        >
          <FiSearch className="h-16 w-16 text-gray-400 dark:text-gray-600" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          No results found
        </h3>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We couldn't find any matches for <span className="font-semibold text-primary-600 dark:text-primary-400">"{query}"</span>
        </p>
        
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-center">
              <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
              Search tips:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left max-w-sm mx-auto">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                Check your spelling
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                Try more general keywords
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                Try different keywords
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                Use fewer keywords
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Or explore our collections:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/universities"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiGlobe className="mr-2" />
              Browse Universities
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiBookOpen className="mr-2" />
              Browse Courses
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // SUCCESS STATE - Show search results
  return (
    <div className="space-y-12">
      {/* Universities Section */}
      {hasUniversities && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <FiGlobe className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Universities
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {displayResults.universities.length} {displayResults.universities.length === 1 ? 'result' : 'results'} found
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayResults.universities.map((university, index) => (
              <motion.div
                key={university.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <UniversityCard university={university} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Courses Section */}
      {hasCourses && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: hasUniversities ? 0.2 : 0 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiBookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Courses
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {displayResults.courses.length} {displayResults.courses.length === 1 ? 'result' : 'results'} found
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayResults.courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;
