import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosConfig';
import SearchResults from '../components/SearchResults';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({ universities: [], courses: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, universities, courses

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    } else {
      // Reset state when no query
      setResults({ universities: [], courses: [], total: 0 });
      setError(null);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ universities: [], courses: [], total: 0 });
      return;
    }

    setLoading(true);
    setError(null);
    setResults({ universities: [], courses: [], total: 0 });

    try {
      console.log('[Search] Searching for:', searchQuery);
      const response = await axiosInstance.get(`/search/?q=${encodeURIComponent(searchQuery)}`);
      console.log('[Search] Response:', response.data);
      
      if (response.data && response.data.results) {
        setResults(response.data.results);
      } else {
        console.error('[Search] Invalid response format:', response.data);
        setError('Received invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('[Search] Error:', err);
      
      // Provide detailed error messages based on error type
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        if (status === 404) {
          setError('Search endpoint not found. Please contact support.');
        } else if (status === 403) {
          setError('You do not have permission to search. Please sign in.');
        } else if (status === 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError(`Search failed (${status}). Please try again.`);
        }
      } else if (err.request) {
        // Request made but no response
        setError('Cannot reach server. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('Failed to perform search. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const hasQuery = searchParams.get('q');
  const hasResults = results.total > 0;

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-github-darkText mb-4">
            Search
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search universities and courses..."
                className="flex-1 px-4 py-3 border border-white/30 dark:border-gray-700/30 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/40 dark:bg-gray-800/40 text-gray-900 dark:text-gray-300"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Results Count - Only show when not loading and has query */}
          {hasQuery && !loading && !error && (
            <p className="text-gray-600 dark:text-github-darkText">
              Found <span className="font-semibold">{results.total}</span> result{results.total !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold">"{hasQuery}"</span>
            </p>
          )}
        </motion.div>

        {/* Tabs - Only show when we have results */}
        {hasQuery && !loading && !error && hasResults && (
          <div className="mb-8 border-b border-gray-200 dark:border-github-darkBorder">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'all', label: 'All', count: results.total },
                { id: 'universities', label: 'Universities', count: (results.universities || []).length },
                { id: 'courses', label: 'Courses', count: (results.courses || []).length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* SearchResults Component - Handles all three states */}
        {hasQuery ? (
          <SearchResults
            loading={loading}
            error={error}
            results={results}
            query={hasQuery}
            activeTab={activeTab}
          />
        ) : (
          // Empty state - No search performed yet
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-github-darkText">
              Start searching
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter keywords above to search for universities and courses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;