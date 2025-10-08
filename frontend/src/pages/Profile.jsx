import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedCourses = async () => {
      if (authLoading || !user) {
        return;
      }
      try {
        const response = await axiosInstance.get('/user/saved-courses/');
        setSavedCourses(response.data);
      } catch (err) {
        console.error('Error fetching saved courses:', err);
        setError('Could not load your saved courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedCourses();
  }, [authLoading, user]);

  const handleRemoveCourse = async (courseId) => {
    try {
      await axiosInstance.delete('/user/saved-courses/', {
        data: {
          course_id: courseId
        }
      });
      setSavedCourses(savedCourses.filter(item => item.course !== courseId));
    } catch (err) {
      console.error('Error removing course:', err);
      setError('Could not remove the course. Please try again later.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-github-darkText">Your Profile</h1>
        <div className="mt-8 bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-github-darkText">
              Personal Information
            </h2>
            <Link
              to="/settings"
              className="inline-flex items-center px-3 py-1 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 dark:bg-github-dark dark:text-primary-400 dark:border-primary-400 dark:hover:bg-github-darkSecondary"
            >
              Edit
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div className="bg-white dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {user?.username}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {user?.email || user?.primaryEmailAddress?.emailAddress || user?.gmail || user?.mail}
                </dd>
              </div>
              <div className="bg-white dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {user?.role === 'admin' || user?.role === 'superuser_admin' ? 'Administrator' : 'Student'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Saved Courses</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-github-darkText">
                View and manage the courses you've saved for later.
              </p>
              <div className="mt-4">
                <Link
                  to="#saved-courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  View Saved Courses
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Compare Courses</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-github-darkText">
                Compare different courses to find the best one for you.
              </p>
              <div className="mt-4">
                <Link
                  to="/compare-courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Compare Courses
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Submit Feedback</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-github-darkText">
                Send feedback to administrators and view responses.
              </p>
              <div className="mt-4">
                <Link
                  to="/feedback"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Go to Feedback
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div id="saved-courses" className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText">Saved Courses</h2>
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : savedCourses.length === 0 ? (
            <div className="mt-4 bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-github-darkText">You haven't saved any courses yet.</p>
              <Link
                to="/courses"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {savedCourses.map((item) => (
                <div key={item.id} className="bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-github-darkText">
                      {item.course_details.name}
                    </h3>
                    <button
                      onClick={() => handleRemoveCourse(item.course)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow dark:border-github-darkBorder-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">University</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                          {item.course_details.university_name}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Level</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                          {item.course_details.level}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Duration</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                          {item.course_details.duration}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-github-dark text-right sm:px-6">
                    <Link
                      to={`/courses/${item.course}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
  {/* Footer removed: now only rendered in App.jsx */}
    </div>
  );
};

export default Profile;
