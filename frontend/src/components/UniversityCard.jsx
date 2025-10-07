import React from 'react';
import { Link } from 'react-router-dom';

const UniversityCard = ({ university }) => {
  if (!university) return null;

  return (
    <div className="panel p-6 rounded-xl shadow-lg" style={{ backgroundColor: '#23242B', color: '#E0E0E0' }}>
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