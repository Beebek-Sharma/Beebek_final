import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    university: ''
  });
  const [universities, setUniversities] = useState([]);
  
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all universities for the filter
        const uniResponse = await axios.get(`${API_URL}/api/universities/`);
        setUniversities(uniResponse.data);
        
        // Parse query parameters from the URL
        const params = new URLSearchParams(location.search);
        const initialQuery = params.get('query') || '';
        const initialUniversity = params.get('university') || '';
        const initialLevel = params.get('level') || '';
        
        setSearchQuery(initialQuery);
        setFilters({
          university: initialUniversity,
          level: initialLevel
        });
        
        // Fetch courses with the filters
        let url = `${API_URL}/api/courses/?query=${initialQuery}`;
        if (initialUniversity) url += `&university=${initialUniversity}`;
        if (initialLevel) url += `&level=${initialLevel}`;
        
        const courseResponse = await axios.get(url);
        setCourses(courseResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Could not load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let url = `${API_URL}/api/courses/?query=${searchQuery}`;
      if (filters.university) url += `&university=${filters.university}`;
      if (filters.level) url += `&level=${filters.level}`;
      
      const response = await axios.get(url);
      setCourses(response.data);
    } catch (err) {
      console.error('Error searching courses:', err);
      setError('Could not search courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      level: '',
      university: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        
        <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Search & Filter</h3>
              <p className="mt-1 text-sm text-gray-500">
                Find the perfect course for your academic journey.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                      Search
                    </label>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search courses..."
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                      University
                    </label>
                    <select
                      id="university"
                      name="university"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={filters.university}
                      onChange={(e) => setFilters({...filters, university: e.target.value})}
                    >
                      <option value="">All Universities</option>
                      {universities.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                      Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={filters.level}
                      onChange={(e) => setFilters({...filters, level: e.target.value})}
                    >
                      <option value="">All Levels</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">No courses found matching your criteria.</p>
              <button
                className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{course.university_name}</p>
                    <div className="mt-2 flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {course.level}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {course.duration}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        ${course.fees}
                      </span>
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default CourseList;
