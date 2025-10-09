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
        <div className="mt-8 p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg leading-6 font-bold">Personal Information</h2>
            <Link
              to="/settings"
              className="inline-flex items-center px-3 py-1 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 dark:bg-github-dark dark:text-primary-400 dark:border-primary-400 dark:hover:bg-github-darkSecondary"
            >
              Edit
            </Link>
          </div>
          <div>
            <dl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-2">
                  <span className="text-sm font-medium opacity-80">Full name</span>
                  <div className="font-semibold">{user?.firstName} {user?.lastName}</div>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium opacity-80">Username</span>
                  <div className="font-semibold">{user?.username}</div>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium opacity-80">Email address</span>
                  <div className="font-semibold">{user?.email || user?.primaryEmailAddress?.emailAddress || user?.gmail || user?.mail}</div>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium opacity-80">Role</span>
                  <div className="font-semibold">{user?.role === 'admin' || user?.role === 'superuser_admin' ? 'Administrator' : 'Student'}</div>
                </div>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300">
            <h3 className="text-lg font-bold mb-2">Saved Courses</h3>
            <p className="text-sm opacity-80 mb-4">View and manage the courses you've saved for later.</p>
            <Link
              to="#saved-courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              View Saved Courses
            </Link>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300">
            <h3 className="text-lg font-bold mb-2">Compare Courses</h3>
            <p className="text-sm opacity-80 mb-4">Compare different courses to find the best one for you.</p>
            <Link
              to="/compare-courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Compare Courses
            </Link>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300">
            <h3 className="text-lg font-bold mb-2">Submit Feedback</h3>
            <p className="text-sm opacity-80 mb-4">Send feedback to administrators and view responses.</p>
            <Link
              to="/feedback"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Go to Feedback
            </Link>
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
            <div className="mt-4 p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300 text-center">
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
                <div key={item.id} className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-darkText transition-colors duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">{item.course_details.name}</h3>
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
                  <div>
                    <dl>
                      <div className="mb-2">
                        <span className="text-sm font-medium opacity-80">University</span>
                        <div className="font-semibold">{item.course_details.university_name}</div>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium opacity-80">Level</span>
                        <div className="font-semibold">{item.course_details.level}</div>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm font-medium opacity-80">Duration</span>
                        <div className="font-semibold">{item.course_details.duration}</div>
                      </div>
                    </dl>
                  </div>
                  <div className="text-right mt-2">
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
