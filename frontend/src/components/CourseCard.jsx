import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="panel p-6 rounded-xl shadow-lg" style={{ backgroundColor: '#23242B', color: '#E0E0E0' }}>
      <h4 className="text-lg font-bold mb-2">{course.name}</h4>
      <p className="opacity-80">{course.description}</p>
      <div className="flex justify-between space-x-4 mb-4 items-center">
        <span className="text-sm text-gray-500">{course.duration}</span>
        <span className="text-lg font-bold text-blue-600">{course.fees}</span>
      </div>
      <Link
        to={`/courses/${course.id}`}
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default CourseCard;