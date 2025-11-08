import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiGlobe, FiAward, FiBookOpen, FiClock, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import axiosInstance from '../utils/axiosConfig';

import Footer from '../components/Footer';

const UniversityDetail = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await axiosInstance.get(`/universities/${id}/`);
        setUniversity(response.data);
      } catch (err) {
        console.error('Error fetching university details:', err);
        setError('Could not load university details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading university details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/universities"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">University not found</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/universities"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/universities"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Universities
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-2xl shadow-2xl overflow-hidden mb-8"
        >
          <div className="px-6 py-12 sm:px-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  {university.image && (
                    <img
                      src={university.image}
                      alt={university.name}
                      className="h-20 w-20 rounded-full bg-white object-cover border-4 border-white/30"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{university.name}</h1>
                    {university.ranking && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900"
                      >
                        <FiAward className="mr-1.5" />
                        World Rank #{university.ranking}
                      </motion.span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-white/90 mt-4">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2 text-white/70" />
                    <span className="text-lg">{university.location}</span>
                  </div>
                  {university.website && (
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-white transition-colors"
                    >
                      <FiGlobe className="mr-2" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 border-2 border-white rounded-xl text-base font-semibold text-white hover:bg-white hover:text-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiGlobe className="mr-2" />
                  Official Website
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* University Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiBookOpen className="mr-3 text-primary-600 dark:text-primary-400" />
              About the University
            </h2>
          </div>
          <div className="px-6 py-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {university.description}
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <FiMapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{university.location}</p>
                </div>
              </div>
              
              {university.ranking && (
                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <FiAward className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">World Ranking</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">#{university.ranking}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiBookOpen className="mr-3 text-primary-600 dark:text-primary-400" />
              Available Courses
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore the programs offered at {university.name}
            </p>
          </div>

          {university.courses && university.courses.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {university.courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {course.name}
                        </h3>
                        <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
                          {course.level}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FiClock className="mr-2 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2">{course.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FiDollarSign className="mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="font-medium">Fees:</span>
                        <span className="ml-2 font-semibold text-green-600 dark:text-green-400">${course.fees}</span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/courses/${course.id}`}
                      className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-12 text-center"
            >
              <FiBookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No courses available for this university yet.</p>
            </motion.div>
          )}
        </motion.div>
      </main>
      <div className="mt-auto">
        {/* Footer removed: now only rendered in App.jsx */}
      </div>
    </div>
  );
};

export default UniversityDetail;
