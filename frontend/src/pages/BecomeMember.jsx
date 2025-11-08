import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BecomeMember() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    interests: [],
  });
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = [
    'Course Recommendations',
    'University Comparisons',
    'Career Guidance',
    'Scholarship Information',
    'Study Abroad Programs',
    'Online Learning',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Membership request:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds and redirect
    setTimeout(() => {
      setSubmitted(false);
      navigate('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="w-full flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/40 dark:bg-gray-800/40 rounded-2xl shadow-2xl p-12 max-w-md text-center border border-white/30 dark:border-gray-700/30"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your membership request has been submitted successfully. We'll get back to you soon!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Become a Member
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our community and get access to exclusive features, personalized course recommendations, and expert guidance.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center border border-white/30 dark:border-gray-700/30">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Course Access
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access to thousands of courses from top universities
            </p>
          </div>

          <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center border border-white/30 dark:border-gray-700/30">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Expert Guidance
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Personalized recommendations from education experts
            </p>
          </div>

          <div className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center border border-white/30 dark:border-gray-700/30">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with students and professionals worldwide
            </p>
          </div>
        </motion.div>

        {/* Membership Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/40 dark:bg-gray-800/40 rounded-2xl shadow-xl overflow-hidden border border-white/30 dark:border-gray-700/30"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Membership Application</h2>
            <p className="text-blue-100 mt-1">Fill out the form below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Why do you want to become a member? *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition resize-none"
                placeholder="Tell us about your educational goals and what you hope to achieve..."
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Areas of Interest
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {interest}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg"
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
