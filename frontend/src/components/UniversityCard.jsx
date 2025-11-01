import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiGlobe, FiStar } from 'react-icons/fi';

const UniversityCard = ({ university }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-github-darkSecondary rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-github-darkBorder"
    >
      <Link to={`/universities/${university.id}`} className="block">
        {/* University Image */}
        {university.image_url && (
          <div className="h-48 overflow-hidden">
            <img
              src={university.image_url}
              alt={university.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=University';
              }}
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-github-darkText mb-2 line-clamp-2">
            {university.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-github-darkTextSecondary mb-3">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{university.location || 'Location not specified'}</span>
          </div>
          
          {/* Description */}
          {university.description && (
            <p className="text-gray-600 dark:text-github-darkTextSecondary text-sm mb-4 line-clamp-3">
              {university.description}
            </p>
          )}
          
          {/* Footer with rating and website */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-github-darkBorder">
            {university.ranking && (
              <div className="flex items-center text-amber-500">
                <FiStar className="w-4 h-4 mr-1 fill-current" />
                <span className="text-sm font-semibold">World Rank #{university.ranking}</span>
              </div>
            )}
            
            {university.website && (
              <div className="flex items-center text-rose-600 dark:text-rose-400">
                <FiGlobe className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Official Website</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default UniversityCard;
