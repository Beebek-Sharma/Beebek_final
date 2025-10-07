import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
      <div className="min-h-screen bg-gray-50 dark:bg-github-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-github-dark">
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
      <div className="min-h-screen bg-gray-50 dark:bg-github-dark">
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
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-github-darkText mr-4">{university.name}</h1>
              {university.ranking && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Rank #{university.ranking}
                </span>
              )}
            </div>
            <p className="mt-2 text-lg text-gray-500 dark:text-github-darkText">{university.location}</p>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow dark:border-github-darkBorder-sm text-sm font-medium text-gray-700 dark:text-github-darkText bg-white dark:bg-github-dark hover:bg-gray-50 dark:bg-github-dark"
            >
              Visit Website
            </a>
          </div>
        </div>
        
        <div className="bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-github-darkText">University Information</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {university.description}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {university.location}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Website</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                    {university.website}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-6">Available Courses</h2>
          
          {university.courses && university.courses.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {university.courses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">{course.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-github-darkText">{course.level}</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-github-darkText line-clamp-3">
                      {course.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-github-darkText">
                        Duration: {course.duration}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-github-darkText">
                        Fees: ${course.fees}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-github-darkText">No courses available for this university.</p>
            </div>
          )}
        </div>
      </main>
      <div className="mt-auto">
  {/* Footer removed: now only rendered in App.jsx */}
      </div>
    </div>
  );
};

export default UniversityDetail;
