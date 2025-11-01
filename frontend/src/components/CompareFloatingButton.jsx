import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLayers, FiX } from 'react-icons/fi';

const CompareFloatingButton = () => {
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    // Load initial compare list
    const loadCompareList = () => {
      const savedCourses = localStorage.getItem('compareCourses');
      if (savedCourses) {
        try {
          const courses = JSON.parse(savedCourses);
          setCompareList(courses);
        } catch (e) {
          console.error('Error parsing saved courses', e);
        }
      }
    };

    loadCompareList();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadCompareList();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCompare = () => {
    navigate('/compare-courses');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    localStorage.setItem('compareCourses', JSON.stringify([]));
    setCompareList([]);
    window.dispatchEvent(new Event('storage'));
  };

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-4 rounded-2xl shadow-2xl cursor-pointer group"
          onClick={handleCompare}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FiLayers className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {compareList.length}
              </span>
            </div>
            <div>
              <p className="font-semibold">Compare Courses</p>
              <p className="text-xs text-white/80">{compareList.length} selected</p>
            </div>
            <button
              onClick={handleClear}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingButton;