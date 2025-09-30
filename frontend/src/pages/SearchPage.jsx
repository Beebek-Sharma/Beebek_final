import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosConfig';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ universities: [], courses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [universitiesResponse, coursesResponse] = await Promise.all([
          axiosInstance.get(`/universities/?query=${query}`),
          axiosInstance.get(`/courses/?query=${query}`)
        ]);

        setResults({
          universities: universitiesResponse.data,
          courses: coursesResponse.data
        });
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <motion.h1
          className="text-3xl font-bold text-gray-900 dark:text-github-darkText mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Search Results for "{query}"
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <motion.div
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : error ? (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        ) : (
          <>
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-github-darkText mb-4">
                Universities ({results.universities.length})
              </h2>
              {results.universities.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {results.universities.map((university, index) => (
                    <motion.div
                      key={university.id}
                      className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg p-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-github-darkText">
                        {university.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-github-darkText line-clamp-3">
                        {university.description}
                      </p>
                      <Link
                        to={`/universities/${university.id}`}
                        className="mt-4 inline-block text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-github-darkText">No universities found.</p>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-github-darkText mb-4">
                Courses ({results.courses.length})
              </h2>
              {results.courses.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {results.courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      className="bg-white dark:bg-github-dark overflow-hidden shadow dark:border-github-darkBorder rounded-lg p-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-github-darkText">
                        {course.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-github-darkText">
                        {course.university_name}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-github-darkText line-clamp-3">
                        {course.description}
                      </p>
                      <Link
                        to={`/courses/${course.id}`}
                        className="mt-4 inline-block text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-github-darkText">No courses found.</p>
              )}
            </motion.section>
          </>
        )}
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default SearchPage;