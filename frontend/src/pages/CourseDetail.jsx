import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark, FiCheck, FiArrowLeft, FiMapPin, FiClock, FiDollarSign, FiAward, FiBookOpen, FiUsers, FiGlobe } from 'react-icons/fi';

import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import CompareButton from '../components/CompareButton';
import CompareFloatingButton from '../components/CompareFloatingButton';
import axiosInstance from '../utils/axiosConfig';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSignedIn, loading: authLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savingStatus, setSavingStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${id}/`);
        setCourse(response.data);
        
        // Fetch university details if needed
        if (response.data.university) {
          const uniResponse = await axiosInstance.get(`/universities/${response.data.university}/`);
          setUniversity(uniResponse.data);
        }
        
        // Check if course is saved by the user
        if (isSignedIn) {
          try {
            const savedResponse = await axiosInstance.get('/user/saved-courses/');
            const isSaved = savedResponse.data.some(item => item.course == id);
            setSaved(isSaved);
          } catch (err) {
            console.error('Error checking if course is saved:', err);
            // Default to not saved if there's an error
            setSaved(false);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Could not load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isSignedIn]);

  const handleSaveCourse = async () => {
    if (!isSignedIn) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    
    try {
      setSavingStatus({ loading: true, error: '' });
      
      if (saved) {
        // If already saved, remove from saved courses
        await axiosInstance.delete('/user/saved-courses/', {
          data: { course_id: id }
        });
        setSaved(false);
      } else {
        // If not saved, add to saved courses
        await axiosInstance.post('/user/saved-courses/', { 
          course_id: id 
        });
        setSaved(true);
      }
    } catch (err) {
      console.error('Error saving/unsaving course:', err);
      setSavingStatus({ 
        loading: false, 
        error: 'Could not update saved courses. Please try again later.' 
      });
    } finally {
      setSavingStatus({ loading: false, error: '' });
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course details...</p>
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
              to="/courses"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Course not found</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/courses"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Courses
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
            to="/courses"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Courses
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
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
                  {course.level}
                </span>
                <h1 className="text-4xl font-bold text-white mb-4">{course.name}</h1>
                {university && (
                  <Link 
                    to={`/universities/${university.id}`} 
                    className="inline-flex items-center text-xl text-white/90 hover:text-white transition-colors group"
                  >
                    <FiGlobe className="mr-2 group-hover:rotate-12 transition-transform" />
                    {university.name}
                    {university.location && (
                      <span className="ml-3 text-sm opacity-75">• {university.location}</span>
                    )}
                  </Link>
                )}
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveCourse}
                  disabled={savingStatus.loading}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg ${
                    saved
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary-600'
                  }`}
                >
                  {savingStatus.loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
                  ) : saved ? (
                    <>
                      <FiCheck className="mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <FiBookmark className="mr-2" />
                      Save Course
                    </>
                  )}
                </motion.button>
                
                <div>
                  <CompareButton courseId={course.id} />
                </div>
              </div>
            </div>
            
            {savingStatus.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-500/20 backdrop-blur-sm border border-red-300 rounded-lg p-4"
              >
                <p className="text-white text-sm">{savingStatus.error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Quick Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.duration}</p>
              </div>
              <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <FiClock className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tuition Fees</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${course.fees}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.level}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FiAward className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          {university && (
            <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 border border-white/30 dark:border-gray-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{university.location}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiMapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Course Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/40 dark:bg-gray-800/40 shadow-xl rounded-2xl overflow-hidden mb-8 border border-white/30 dark:border-gray-700/30"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiBookOpen className="mr-3 text-primary-600 dark:text-primary-400" />
              Course Overview
            </h2>
          </div>
          <div className="px-6 py-8">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>
        </motion.div>

        {/* Related Courses */}
        {university && university.courses && university.courses.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FiUsers className="mr-3 text-primary-600 dark:text-primary-400" />
                More Courses at {university.name}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Explore other programs offered by this university
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {university.courses
                .filter(c => c.id !== parseInt(id))
                .slice(0, 3)
                .map((relatedCourse, index) => (
                  <motion.div
                    key={relatedCourse.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/30 dark:border-gray-700/30"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {relatedCourse.name}
                          </h3>
                          <span className="inline-block mt-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
                            {relatedCourse.level}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {relatedCourse.description}
                      </p>
                      
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <FiClock className="mr-2 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                          <span className="font-medium">Duration:</span>
                          <span className="ml-2">{relatedCourse.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <FiDollarSign className="mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="font-medium">Fees:</span>
                          <span className="ml-2 font-semibold text-green-600 dark:text-green-400">${relatedCourse.fees}</span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/courses/${relatedCourse.id}`}
                        className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </main>
      <div className="mt-auto">
        {/* Footer removed: now only rendered in App.jsx */}
      </div>
      
      {/* Floating comparison button */}
      <CompareFloatingButton />
    </div>
  );
};

export default CourseDetail;
