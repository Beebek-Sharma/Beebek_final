import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
          Searching...
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Finding the best matches for "{query}"
        </p>
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
        className="my-8"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-6 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Search Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100 underline"
                >
                  Retry search →
                </button>
              </div>
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
        className="text-center py-16"
      >
        <svg
          className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-github-darkText">
          No results found
        </h3>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          We couldn't find any matches for <span className="font-semibold">"{query}"</span>
        </p>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your search terms or browse our collections:
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              to="/universities"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Browse Universities
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-github-darkCard hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
        <div className="mt-8 text-left max-w-md mx-auto">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search tips:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Check your spelling</li>
            <li>• Try more general keywords</li>
            <li>• Try different keywords</li>
            <li>• Use fewer keywords</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  // SUCCESS STATE - Show search results
  return (
    <div className="space-y-10">
      {/* Universities Section */}
      {hasUniversities && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText">
              Universities
              <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
                ({displayResults.universities.length})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayResults.universities.map((university, index) => (
              <motion.div
                key={university.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText">
              Courses
              <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
                ({displayResults.courses.length})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayResults.courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
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
