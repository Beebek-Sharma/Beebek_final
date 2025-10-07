import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import CompareButton from '../components/CompareButton';
import CompareFloatingButton from '../components/CompareFloatingButton';
import axiosInstance from '../utils/axiosConfig';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSignedIn, loading: authLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savingStatus, setSavingStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${id}/`);
        setCourse(response.data);
        
        // Fetch university details if needed
        if (response.data.university) {
          const uniResponse = await axiosInstance.get(`/universities/${response.data.university}/`);
          setUniversity(uniResponse.data);
        }
        
        // Check if course is saved by the user
        if (isSignedIn) {
          try {
            const savedResponse = await axiosInstance.get('/user/saved-courses/');
            const isSaved = savedResponse.data.some(item => item.course == id);
            setSaved(isSaved);
          } catch (err) {
            console.error('Error checking if course is saved:', err);
            // Default to not saved if there's an error
            setSaved(false);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Could not load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isSignedIn]);

  const handleSaveCourse = async () => {
    if (!isSignedIn) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    
    try {
      setSavingStatus({ loading: true, error: '' });
      
      if (saved) {
        // If already saved, remove from saved courses
        await axiosInstance.delete('/user/saved-courses/', {
          data: { course_id: id }
        });
        setSaved(false);
      } else {
        // If not saved, add to saved courses
        await axiosInstance.post('/user/saved-courses/', { 
          course_id: id 
        });
        setSaved(true);
      }
    } catch (err) {
      console.error('Error saving/unsaving course:', err);
      setSavingStatus({ 
        loading: false, 
        error: 'Could not update saved courses. Please try again later.' 
      });
    } finally {
      setSavingStatus({ loading: false, error: '' });
    }
  };

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
              to="/courses"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-github-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Course not found</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/courses"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-github-darkText">{course.name}</h1>
              {university && (
                <Link to={`/universities/${university.id}`} className="mt-1 text-lg text-primary-600 hover:text-primary-800">
                  {university.name}
                </Link>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-4">
              <button
                onClick={handleSaveCourse}
                disabled={savingStatus.loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  saved
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {savingStatus.loading ? (
                  <span>Processing...</span>
                ) : saved ? (
                  <span>Remove from Saved</span>
                ) : (
                  <span>Save Course</span>
                )}
              </button>
              
              <div className="mt-3 sm:mt-0">
                <CompareButton courseId={course.id} />
              </div>
            </div>
          </div>
          
          {savingStatus.error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{savingStatus.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-github-darkText">Course Information</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {course.description}
                </dd>
              </div>
              <div className="bg-white dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Level</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {course.level}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  {course.duration}
                </dd>
              </div>
              <div className="bg-white dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">Fees</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                  ${course.fees}
                </dd>
              </div>
              {university && (
                <div className="bg-gray-50 dark:bg-github-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-github-darkText">University Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-github-darkText sm:mt-0 sm:col-span-2">
                    {university.location}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {university && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-6">Other Courses at {university.name}</h2>
            
            {university.courses && university.courses.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {university.courses
                  .filter(c => c.id !== parseInt(id))
                  .slice(0, 3)
                  .map((relatedCourse) => (
                    <div key={relatedCourse.id} className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">{relatedCourse.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-github-darkText">{relatedCourse.level}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-github-darkText line-clamp-3">
                          {relatedCourse.description}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-github-darkText">
                            Duration: {relatedCourse.duration}
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-github-darkText">
                            Fees: ${relatedCourse.fees}
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to={`/courses/${relatedCourse.id}`}
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
                <p className="text-gray-500 dark:text-github-darkText">No other courses available at this university.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <div className="mt-auto">
  {/* Footer removed: now only rendered in App.jsx */}
      </div>
      
      {/* Floating comparison button */}
      <CompareFloatingButton />
    </div>
  );
};

export default CourseDetail;
