import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniversityCard from '../components/UniversityCard';
import CourseCard from '../components/CourseCard';
import CompareFloatingButton from '../components/CompareFloatingButton';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Your Perfect University
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Search and compare universities and courses to make the best choice for your future.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex rounded-md shadow">
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
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Explore Courses
              </Link>
            </div>
            <div className="inline-flex">
              <Link
                to="/compare-courses"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Compare Courses
              </Link>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Search</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Browse through our comprehensive database of universities and courses.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Compare</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Compare different courses and universities side by side.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Apply</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Save your favorite courses and get application guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Popular Universities Section */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularItems.popular_universities.length > 0 ? (
                popularItems.popular_universities.map(university => (
                  <UniversityCard key={university.id} university={university} />
                ))
              ) : (
                <p className="col-span-4 text-center text-gray-500 py-10">No popular universities found.</p>
              )}
            </div>
          )}
        </div>
        
        {/* Popular Courses Section */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularItems.popular_courses.length > 0 ? (
                popularItems.popular_courses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="col-span-4 text-center text-gray-500 py-10">No popular courses found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      
      <div className="mt-auto">
        <Footer />
      </div>
      
      {/* Floating comparison button */}
      <CompareFloatingButton />
    </div>
  );
};

export default Home;
