import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <motion.input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search universities and courses..."
          className="w-full pl-10 pr-4 py-2 border border-white/30 dark:border-gray-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-github-darkLink bg-white/40 dark:bg-gray-800/40 text-gray-900 dark:text-gray-300 transition-all duration-200"
          whileFocus={{ scale: 1.02 }}
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-github-darkTextSecondary w-5 h-5" />
      </div>
    </form>
  );
};

export default SearchBar;