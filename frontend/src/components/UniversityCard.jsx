import React from 'react';
import { Link } from 'react-router-dom';

const UniversityCard = ({ university }) => {
  if (!university) return null;

  return (
    <div className="p-6 rounded-xl shadow-md 
                               bg-github-lightAccent dark:bg-github-darkAccent 
                               text-github-lightText dark:text-github-darkText 
                               transition-colors duration-300" style={{ transform: "none" }}>
      <h4 className="text-lg font-bold mb-2">{university.name}</h4>
      <p className="opacity-80">{university.description}</p>
      <Link
        to={`/universities/${university.id}`}
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default UniversityCard;