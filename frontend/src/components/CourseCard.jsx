import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="bg-github-lightAccent dark:bg-github-darkAccent rounded-lg shadow p-6 flex flex-col items-center transition-colors duration-300">
  <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
  <p className="text-gray-600 mb-2">{course.university_name}</p>
      <p className="text-white-700 mb-4">{course.description}</p>
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