import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const [course, setCourse] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savingStatus, setSavingStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/courses/${id}/`);
        setCourse(response.data);
        
        // Fetch university details if needed
        if (response.data.university) {
          const uniResponse = await axios.get(`${API_URL}/api/universities/${response.data.university}/`);
          setUniversity(uniResponse.data);
        }
        
        // Check if course is saved by the user
        if (isSignedIn) {
          // Clerk: get token if needed, or adjust API to use Clerk session
          // For now, skip token and just setSaved(false) as placeholder
          setSaved(false); // TODO: Integrate Clerk session with backend if needed
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
  // Clerk: Integrate with backend if needed, for now just toggle saved state
  setSaved(!saved);
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
      <div className="min-h-screen bg-gray-50">
        <Header />
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
      <div className="min-h-screen bg-gray-50">
        <Header />
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
      <div className="min-h-screen bg-gray-50">
        <Header />
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
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
              
              {isSignedIn && (
                <Link
                  to="/compare-courses"
                  state={{ courseId: course.id }}
                  className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Compare
                </Link>
              )}
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
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Course Information</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.description}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Level</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.level}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.duration}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Fees</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ${course.fees}
                </dd>
              </div>
              {university && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">University Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {university.location}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {university && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Courses at {university.name}</h2>
            
            {university.courses && university.courses.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {university.courses
                  .filter(c => c.id !== parseInt(id))
                  .slice(0, 3)
                  .map((relatedCourse) => (
                    <div key={relatedCourse.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900">{relatedCourse.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{relatedCourse.level}</p>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                          {relatedCourse.description}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Duration: {relatedCourse.duration}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
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
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
                <p className="text-gray-500">No other courses available at this university.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default CourseDetail;
