import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import InfoCard from '../components/InfoCard';
import UniversityCard from '../components/UniversityCard';
import CourseCard from '../components/CourseCard';
import CompareFloatingButton from '../components/CompareFloatingButton';
import FeedbackSidebar from '../components/FeedbackSidebar';
import axiosInstance from '../utils/axiosConfig';

const Home = () => {
  const [popularItems, setPopularItems] = useState({
    universities: [],
    courses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await axiosInstance.get('/popular/');
        setPopularItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching popular items:', err);
        setError('Failed to load popular items');
        setLoading(false);
      }
    };
    fetchPopularItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1 lg:pr-[260px]">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-sky-500 to-cyan-600 bg-clip-text text-transparent sm:tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Find Your Perfect University
              </motion.h1>
              <motion.p
                className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Search and compare universities and courses to make the best choice for your future.
              </motion.p>
              <motion.div
                className="mt-10 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/universities"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-lg"
                  >
                    Browse Universities
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
                  >
                    Explore Courses
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/compare-courses"
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
                  >
                    Compare Courses
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl font-extrabold text-gray-900 dark:text-white mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                How It Works
              </motion.h2>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    icon: <span className="text-5xl">🔍</span>,
                    title: 'Search',
                    description: 'Browse through our comprehensive database of universities and courses.'
                  },
                  {
                    icon: <span className="text-5xl">⚖️</span>,
                    title: 'Compare',
                    description: 'Compare different courses and universities side by side.'
                  },
                  {
                    icon: <span className="text-5xl">🎓</span>,
                    title: 'Apply',
                    description: 'Save your favorite courses and get application guidance.'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Popular Universities Section */}
            <motion.div
              className="mt-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-10">
                <motion.h2
                  className="text-3xl font-extrabold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Popular Universities
                </motion.h2>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    to="/universities"
                    className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 font-semibold flex items-center group transition-all duration-200"
                  >
                    View all
                    <motion.svg
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <motion.div
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : error ? (
                <motion.div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg my-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(popularItems?.universities) && popularItems.universities.length > 0 ? (
                    popularItems.universities.slice(0, 6).map((university, index) => (
                      <motion.div
                        key={university.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <UniversityCard university={university} />
                      </motion.div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 dark:text-gray-400 py-10">
                      No popular universities found.
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Popular Courses Section */}
            <motion.div
              className="mt-24 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-10">
                <motion.h2
                  className="text-3xl font-extrabold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Popular Courses
                </motion.h2>
                <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    to="/courses"
                    className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 font-semibold flex items-center group transition-all duration-200"
                  >
                    View all
                    <motion.svg
                      className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <motion.div
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : error ? (
                <motion.div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg my-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(popularItems?.courses) && popularItems.courses.length > 0 ? (
                    popularItems.courses.slice(0, 6).map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <CourseCard course={course} />
                      </motion.div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 dark:text-gray-400 py-10">
                      No popular courses found.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </main>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:w-80" style={{ position: 'absolute', right: 30, top: '100px' }}>
            <div className="sticky top-20">
              <FeedbackSidebar />
            </div>
          </div>
        </div>
      </div>
      <CompareFloatingButton />
    </div>
  );
};
export default Home;
