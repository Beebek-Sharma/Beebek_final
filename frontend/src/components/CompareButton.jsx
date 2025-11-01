import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const COMPARE_LIMIT = 5;

const CompareButton = ({ courseId }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  useEffect(() => {
    // Check if course is already in comparison
    const savedCourses = localStorage.getItem('compareCourses');
    if (savedCourses) {
      try {
        const parsedCourses = JSON.parse(savedCourses);
        setIsAdded(parsedCourses.includes(parseInt(courseId)));
      } catch (e) {
        console.error('Error parsing saved courses', e);
      }
    }
  }, [courseId]);

  const handleClick = () => {
    const savedCourses = localStorage.getItem('compareCourses');
    let courses = [];
    
    if (savedCourses) {
      try {
        courses = JSON.parse(savedCourses);
      } catch (e) {
        console.error('Error parsing saved courses', e);
      }
    }

    const courseIdInt = parseInt(courseId);
    
    if (isAdded) {
      // Remove from comparison
      courses = courses.filter(id => id !== courseIdInt);
      setIsAdded(false);
      setShowLimitMessage(false);
    } else {
      // Check if limit is reached
      if (courses.length >= COMPARE_LIMIT) {
        setShowLimitMessage(true);
        setTimeout(() => setShowLimitMessage(false), 3000);
        return;
      }
      
      // Add to comparison
      if (!courses.includes(courseIdInt)) {
        courses.push(courseIdInt);
        setIsAdded(true);
      }
    }

    localStorage.setItem('compareCourses', JSON.stringify(courses));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg ${
          isAdded
            ? 'bg-teal-600 hover:bg-teal-700 text-white'
            : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-teal-600'
        }`}
      >
        {isAdded ? (
          <>
            <FiCheckCircle className="mr-2" />
            Added to Compare
          </>
        ) : (
          <>
            <FiPlusCircle className="mr-2" />
            Add to Compare
          </>
        )}
      </motion.button>
      
      {/* Limit Warning Message */}
      {showLimitMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 left-0 right-0 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center whitespace-nowrap z-50"
        >
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          Maximum {COMPARE_LIMIT} courses can be compared
        </motion.div>
      )}
    </div>
  );
};

export default CompareButton;