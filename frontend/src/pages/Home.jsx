import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import UniversityCard from '../components/UniversityCard';
import CourseCard from '../components/CourseCard';
import CompareFloatingButton from '../components/CompareFloatingButton';
import FeedbackSidebar from '../components/FeedbackSidebar';
import axiosInstance from '../utils/axiosConfig';

const Home = () => {
  const [popularItems, setPopularItems] = useState({
    popular_universities: [],
    popular_courses: []
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
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-github-darkText sm:text-5xl sm:tracking-tight lg:text-6xl">
                Find Your Perfect University
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-github-darkText">
                Search and compare universities and courses to make the best choice for your future.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <div className="inline-flex rounded-md shadow dark:border-github-darkBorder">
                  <Link
                    to="/universities"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Universities
                  </Link>
                </div>
                <div className="inline-flex">
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white dark:bg-github-dark hover:bg-gray-50 dark:bg-github-dark"
                  >
                    Explore Courses
                  </Link>
                </div>
                <div className="inline-flex">
                  <Link
                    to="/compare-courses"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white dark:bg-github-dark hover:bg-gray-50 dark:bg-github-dark"
                  >
                    Compare Courses
                  </Link>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-20">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-github-darkText mb-8 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Search</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-github-darkText">
                      Browse through our comprehensive database of universities and courses.
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Compare</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-github-darkText">
                      Compare different courses and universities side by side.
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Apply</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-github-darkText">
                      Save your favorite courses and get application guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Universities Section */}
            <div className="mt-20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-github-darkText">
                  Popular Universities
                </h2>
                <Link
                  to="/universities"
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  View all
                  <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {popularItems.popular_universities.length > 0 ? (
                    popularItems.popular_universities.map(university => (
                      <UniversityCard key={university.id} university={university} />
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 dark:text-github-darkText py-10">No popular universities found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Popular Courses Section */}
            <div className="mt-20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-github-darkText">
                  Popular Courses
                </h2>
                <Link
                  to="/courses"
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  View all
                  <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {popularItems.popular_courses.length > 0 ? (
                    popularItems.popular_courses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 dark:text-github-darkText py-10">No popular courses found.</p>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Only visible on desktop */}
          <div className="hidden lg:block lg:w-80" style={{ position: 'absolute', right: 30, top: '100px' }}>
            <div className="sticky top-20">
              <FeedbackSidebar />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>

      {/* Floating comparison button */}
      <CompareFloatingButton />
    </div>
  );
};

export default Home;
