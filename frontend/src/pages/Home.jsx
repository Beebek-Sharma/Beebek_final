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
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1 lg:pr-[260px]">
            {/* Hero Section */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl font-extrabold text-gray-900 dark:text-github-darkText sm:text-5xl sm:tracking-tight lg:text-6xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Find Your Perfect University
              </motion.h1>
              <motion.p
                className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-github-darkText"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Search and compare universities and courses to make the best choice for your future.
              </motion.p>
              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div
                  className="inline-flex rounded-md shadow dark:border-github-darkBorder"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/universities"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200"
                  >
                    Browse Universities
                  </Link>
                </motion.div>
                <motion.div
                  className="inline-flex"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white dark:bg-github-dark hover:bg-gray-50 dark:bg-github-dark transition-all duration-200"
                  >
                    Explore Courses
                  </Link>
                </motion.div>
                <motion.div
                  className="inline-flex"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/compare-courses"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white dark:bg-github-dark hover:bg-gray-50 dark:bg-github-dark transition-all duration-200"
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
                className="text-2xl font-extrabold text-gray-900 dark:text-github-darkText mb-8 text-center"
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
                    icon: <span className="text-4xl">🔍</span>,
                    title: 'Search',
                    description: 'Browse through our comprehensive database of universities and courses.',
                  },
                  {
                    icon: <span className="text-4xl">⚖️</span>,
                    title: 'Compare',
                    description: 'Compare different courses and universities side by side.',
                  },
                  {
                    icon: <span className="text-4xl">🎓</span>,
                    title: 'Apply',
                    description: 'Save your favorite courses and get application guidance.',
                  }
                ].map((item, index) => (
                  <InfoCard key={index} icon={item.icon} title={item.title} description={item.description} />
                ))}
              </div>
            </motion.div>

            {/* Popular Universities Section */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  className="text-2xl font-extrabold text-gray-900 dark:text-github-darkText"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Popular Universities
                </motion.h2>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to="/universities"
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center group transition-all duration-200"
                  >
                    View all
                    <motion.svg
                      className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <motion.div
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : error ? (
                <motion.div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(popularItems?.universities) && popularItems.universities.length > 0 ? (
                    popularItems.universities.slice(0, 4).map((university, index) => (
                      <motion.div
                        key={university.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="bg-white dark:bg-github-darkCard rounded-lg shadow">
                          <UniversityCard university={university} />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 dark:text-github-darkText py-10">No popular universities found.</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Popular Courses Section */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  className="text-2xl font-extrabold text-gray-900 dark:text-github-darkText"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Popular Courses
                </motion.h2>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to="/courses"
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center group transition-all duration-200"
                  >
                    View all
                    <motion.svg
                      className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <motion.div
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : error ? (
                <motion.div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(popularItems?.courses) && popularItems.courses.length > 0 ? (
                    popularItems.courses.slice(0, 4).map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="bg-white dark:bg-github-darkCard rounded-lg shadow">
                          <CourseCard course={course} />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 dark:text-github-darkText py-10">No popular courses found.</p>
                  )}
                </div>
              )}
            </motion.div>
          </main>

          {/* Right Sidebar - Only visible on desktop */}
          <div className="hidden lg:block lg:w-80" style={{ position: 'absolute', right: 30, top: '100px' }}>
            <div className="sticky top-20">
              <FeedbackSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Footer removed: now only rendered in App.jsx */}

      {/* Floating comparison button */}
      <CompareFloatingButton />
    </div>
  );

}
export default Home;