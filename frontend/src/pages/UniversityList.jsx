import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

import Footer from '../components/Footer';

// API_URL not needed, use axiosInstance

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
  const response = await axiosInstance.get('/universities/');
  setUniversities(response.data);
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Could not load universities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const filteredUniversities = universities.filter(university => 
    university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    university.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-github-darkText">Universities</h1>
        
        <div className="mt-6">
          <div className="max-w-lg">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow dark:border-github-darkBorder-sm ">
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full p-[8px] sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400 dark:text-github-darkText" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
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
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="mt-8 bg-white dark:bg-github-dark shadow dark:border-github-darkBorder overflow-hidden sm:rounded-lg p-6 text-center">
            <p className="text-gray-500 dark:text-github-darkText">No universities found matching your search.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredUniversities.map((university) => (
              <div key={university.id} className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-github-darkText">{university.name}</h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-github-darkText">{university.location}</p>
                  {university.ranking && (
                    <p className="mt-2 text-sm text-gray-700 dark:text-github-darkText">
                      Ranking: <span className="font-medium">#{university.ranking}</span>
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-600 dark:text-github-darkText line-clamp-3">
                    {university.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/universities/${university.id}`}
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
      </main>
      <div className="mt-auto">
  {/* Footer removed: now only rendered in App.jsx */}
      </div>
    </div>
  );
};

export default UniversityList;
