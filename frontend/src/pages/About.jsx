import React from 'react';

import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="max-w-5xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-github-darkText mb-8">About Us</h1>
        <div className="space-y-8">
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <p className="text-lg text-gray-700 dark:text-github-darkText mb-6">Welcome to EduConnect!</p>
            <p className="text-gray-600 dark:text-github-darkText mb-6">We believe that every student deserves access to quality education. Our mission is to create meaningful connections through educational resources, helping students find value, inspiration, and make informed decisions about their academic future.</p>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-github-darkText mb-6">It all began with a simple idea: to make university course selection easier for students. What started as a final year project has grown into a comprehensive platform where students can explore, compare, and save courses from various universities.</p>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-4">What We Stand For</h2>
            <p className="text-gray-600 dark:text-github-darkText mb-4">At the heart of our work are five core values:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-sky-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-800">Integrity</h3>
                <p className="text-gray-600 dark:text-github-darkText">Providing accurate and honest information about educational opportunities.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Creativity</h3>
                <p className="text-gray-600 dark:text-github-darkText">Finding fresh solutions to help students navigate their educational journey.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Dedication</h3>
                <p className="text-gray-600 dark:text-github-darkText">Serving our student community with care and attention to their needs.</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Growth</h3>
                <p className="text-gray-600 dark:text-github-darkText">Always learning and improving our platform to better serve students.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg md:col-span-2">
                <h3 className="font-semibold text-red-800">Connection</h3>
                <p className="text-gray-600 dark:text-github-darkText">Building lasting relationships between students, universities, and educational resources.</p>
              </div>
            </div>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-4">Meet the Team</h2>
            <p className="text-gray-600 dark:text-github-darkText mb-6">Behind the scenes, we're a group of passionate developers, designers, and educators who love what we do and care deeply about helping students make informed decisions about their education.</p>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-5 text-gray-600 dark:text-github-darkText mb-6">
              <li className="mb-2">Comprehensive database of universities and courses updated regularly</li>
              <li className="mb-2">User-friendly comparison tools to help you make informed decisions</li>
              <li className="mb-2">Direct feedback system to connect with administrators</li>
            </ul>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-4">What's Next?</h2>
            <p className="text-gray-600 dark:text-github-darkText mb-6">We'd love for you to be part of our journey.</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <a href="/courses" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">Browse Courses</a>
              <a href="/universities" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">Explore Universities</a>
              <a href="/contact" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow dark:border-github-darkBorder-sm text-base font-medium rounded-md text-gray-700 dark:text-github-darkText bg-white dark:bg-github-dark hover:bg-gray-50 dark:bg-github-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">Contact Us</a>
            </div>
          </section>
        </div>
      </main>
      <div className="mt-auto">
        {/* Footer removed: now only rendered in App.jsx */}
      </div>
    </div>
  );
};

export default About;
