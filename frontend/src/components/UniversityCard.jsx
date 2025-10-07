import React from 'react';
import { Link } from 'react-router-dom';

const UniversityCard = ({ university }) => {
  if (!university) return null;

  return (
    <div className="bg-github-lightAccent dark:bg-github-darkAccent rounded-lg shadow p-6 flex flex-col items-center transition-colors duration-300">
      <h3 className="text-xl font-semibold mb-2">{university.name}</h3>
      <p className="text-white-600 mb-2">{university.location}</p>
      <p className="text-white-700 mb-4">{university.description}</p>
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