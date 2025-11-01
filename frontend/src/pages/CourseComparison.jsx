import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiBookOpen, FiClock, FiDollarSign, FiAward, FiMapPin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

const COMPARE_LIMIT = 5;

const CourseComparison = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const initialCourseId = location.state?.courseId;
  
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(() => {
    const savedCourses = localStorage.getItem('compareCourses');
    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        return parsedCourses.map(id => parseInt(id));
      } catch (e) {
        console.error('Error parsing saved courses', e);
      }
    }
    return initialCourseId ? [initialCourseId] : [];
  });
  const [loading, setLoading] = useState(true);
  const [compareData, setCompareData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses/');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Could not load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCompareData = async () => {
      if (selectedCourses.length === 0) {
        setCompareData([]);
        return;
      }
      try {
        setLoading(true);
        const courseData = [];
        const validCourseIds = [];
        
        // Fetch each course and filter out invalid IDs
        for (const courseId of selectedCourses) {
          try {
            const response = await axiosInstance.get(`/courses/${courseId}/`);
            courseData.push(response.data);
            validCourseIds.push(courseId);
          } catch (err) {
            if (err.response?.status === 404) {
              console.warn(`Course ${courseId} not found, removing from comparison`);
              // Skip this course - it doesn't exist
            } else {
              // Re-throw if it's not a 404 error
              throw err;
            }
          }
        }
        
        // Update selectedCourses if any were invalid
        if (validCourseIds.length !== selectedCourses.length) {
          setSelectedCourses(validCourseIds);
        }
        
        setCompareData(courseData);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Could not load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompareData();
  }, [selectedCourses]);
  
  useEffect(() => {
    localStorage.setItem('compareCourses', JSON.stringify(selectedCourses));
    window.dispatchEvent(new Event('storage'));
  }, [selectedCourses]);

  const handleCourseSelect = (e) => {
    const courseId = parseInt(e.target.value);
    if (courseId && !selectedCourses.includes(courseId)) {
      // Check if limit is reached
      if (selectedCourses.length >= COMPARE_LIMIT) {
        setError(`You can only compare up to ${COMPARE_LIMIT} courses at a time.`);
        setTimeout(() => setError(''), 3000);
        return;
      }
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(id => id !== courseId));
  };

  const ComparisonFeature = ({ label, icon: Icon, values, highlight = false }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`grid grid-cols-${values.length + 1} gap-4 p-4 rounded-lg ${
        highlight ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-github-darkAccent'
      } transition-colors duration-200`}
    >
      <div className="flex items-center space-x-2 font-semibold text-gray-700 dark:text-github-darkText">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span>{label}</span>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex items-center justify-center text-gray-600 dark:text-github-darkTextSecondary">
          {value || '-'}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-github-dark dark:to-github-darkSecondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-github-darkText mb-4">Compare Courses</h1>
          <p className="text-lg text-gray-600 dark:text-github-darkTextSecondary">
            Select up to {COMPARE_LIMIT} courses and compare them side by side
          </p>
        </motion.div>

        {!isAuthenticated ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-white dark:bg-github-darkSecondary rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-github-darkText mb-2">Authentication Required</h3>
            <p className="text-gray-600 dark:text-github-darkTextSecondary mb-6">Please log in to use the course comparison feature</p>
            <Link to="/login" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200">
              Log In
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-github-darkSecondary rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-github-darkBorder">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <FiPlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-github-darkText">Select Courses</h2>
                    <p className="text-sm text-gray-600 dark:text-github-darkTextSecondary">
                      {selectedCourses.length}/{COMPARE_LIMIT} courses selected
                    </p>
                  </div>
                </div>
                {selectedCourses.length >= COMPARE_LIMIT && (
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm font-medium">
                    <FiAlertCircle className="w-4 h-4" />
                    <span>Maximum limit reached</span>
                  </div>
                )}
              </div>

              <select 
                className="w-full px-4 py-3 border border-gray-300 dark:border-github-darkBorder bg-white dark:bg-github-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-github-darkText disabled:opacity-50 disabled:cursor-not-allowed" 
                onChange={handleCourseSelect} 
                value="" 
                disabled={selectedCourses.length >= COMPARE_LIMIT || loading}
              >
                <option value="">
                  {selectedCourses.length >= COMPARE_LIMIT 
                    ? `Maximum ${COMPARE_LIMIT} courses selected` 
                    : 'Select a course to compare'
                  }
                </option>
                {courses.filter(course => !selectedCourses.includes(course.id)).map((course) => (
                  <option key={course.id} value={course.id}>{course.name} - {course.university_name}</option>
                ))}
              </select>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3"
                  >
                    <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {compareData.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 flex flex-wrap gap-3">
                    {compareData.map((course) => (
                      <motion.div key={course.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full font-medium">
                        <FiCheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{course.name}</span>
                        <button onClick={() => handleRemoveCourse(course.id)} className="ml-2 p-1 hover:bg-primary-200 dark:hover:bg-primary-800/50 rounded-full transition-colors duration-200">
                          <FiX className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {loading && selectedCourses.length > 0 && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              </div>
            )}

            {!loading && compareData.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-github-darkSecondary rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-github-darkBorder">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-6">Comparison Results</h2>
                <div className={`grid grid-cols-${compareData.length + 1} gap-4 mb-6`}>
                  <div></div>
                  {compareData.map((course) => (
                    <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-xl p-4 text-white">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.name}</h3>
                      <p className="text-sm opacity-90">{course.university_name}</p>
                      <Link to={`/courses/${course.id}`} className="inline-block mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200">
                        View Details →
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-2">
                  <ComparisonFeature label="University" icon={FiMapPin} values={compareData.map(c => c.university_name)} />
                  <ComparisonFeature label="Level" icon={FiAward} values={compareData.map(c => c.level)} highlight />
                  <ComparisonFeature label="Duration" icon={FiClock} values={compareData.map(c => c.duration)} />
                  <ComparisonFeature label="Fees" icon={FiDollarSign} values={compareData.map(c => c.fees)} highlight />
                </div>
              </motion.div>
            ) : !loading && compareData.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-github-darkSecondary rounded-2xl shadow-xl p-12 text-center border border-gray-200 dark:border-github-darkBorder">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-github-darkText mb-2">No Courses Selected</h3>
                <p className="text-gray-600 dark:text-github-darkTextSecondary">Select courses from the dropdown above to start comparing</p>
              </motion.div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseComparison;
