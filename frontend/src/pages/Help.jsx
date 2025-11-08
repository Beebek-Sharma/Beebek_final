import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'account', name: 'Account & Login', icon: '👤' },
    { id: 'courses', name: 'Courses & Universities', icon: '🎓' },
    { id: 'technical', name: 'Technical Issues', icon: '⚙️' },
    { id: 'billing', name: 'Billing & Payments', icon: '💳' },
  ];

  const faqs = [
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on the "Register" button in the top navigation bar. Fill in your details including email, username, and password. You can also sign up using Google for quick access.',
    },
    {
      category: 'account',
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you instructions to reset your password. The reset link is valid for 24 hours.',
    },
    {
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to Settings from the user menu, then select Profile Settings. You can update your name, bio, profile picture, and other personal information.',
    },
    {
      category: 'courses',
      question: 'How do I search for courses?',
      answer: 'Use the search bar at the top of the page or navigate to the Courses page. You can filter courses by university, subject, level, and more.',
    },
    {
      category: 'courses',
      question: 'Can I compare multiple courses?',
      answer: 'Yes! Use the compare feature available on course listings. You can compare up to 3 courses side-by-side to help make your decision.',
    },
    {
      category: 'courses',
      question: 'How do I save courses for later?',
      answer: 'Click the bookmark icon on any course card to save it to your favorites. Access your saved courses from your profile.',
    },
    {
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Try clearing your browser cache and cookies. If the issue persists, try using a different browser or check your internet connection.',
    },
    {
      category: 'technical',
      question: 'I\'m having issues with the chat widget',
      answer: 'Make sure you\'re logged in to use the AI chat feature. If problems continue, try refreshing the page or clearing your browser cache.',
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal. Some regions may have additional local payment options.',
    },
    {
      category: 'billing',
      question: 'Can I get a refund?',
      answer: 'Refund policies vary depending on the service. Please check our refund policy page or contact support for specific cases.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === 'all' || faq.category === selectedCategory) &&
      (searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (formSubmitted) {
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
            Message Sent!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for contacting us. Our support team will get back to you within 24 hours.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How Can We Help You?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions or contact our support team for personalized assistance.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full px-6 py-4 pl-14 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition shadow-lg"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          <button
            onClick={() => navigate('/courses')}
            className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition group border border-white/30 dark:border-gray-700/30"
          >
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Browse Courses
            </h3>
          </button>

          <button
            onClick={() => navigate('/universities')}
            className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition group border border-white/30 dark:border-gray-700/30"
          >
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Find Universities
            </h3>
          </button>

          <button
            onClick={() => navigate('/contact')}
            className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition group border border-white/30 dark:border-gray-700/30"
          >
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Contact Support
            </h3>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition group border border-white/30 dark:border-gray-700/30"
          >
            <div className="text-4xl mb-3">ℹ️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              About Us
            </h3>
          </button>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 border border-white/30 dark:border-gray-700/30'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/40 dark:bg-gray-800/40 rounded-xl shadow-md overflow-hidden group border border-white/30 dark:border-gray-700/30"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-900 dark:text-white list-none flex items-center justify-between">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                </motion.details>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No results found. Try a different search term or category.
              </p>
            </div>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/40 dark:bg-gray-800/40 rounded-2xl shadow-xl overflow-hidden border border-white/30 dark:border-gray-700/30"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Still Need Help?</h2>
            <p className="text-blue-100 mt-1">Send us a message and we'll get back to you</p>
          </div>

          <form onSubmit={handleContactSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={contactForm.subject}
                onChange={handleContactChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition resize-none"
                placeholder="Describe your issue or question in detail..."
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Back to Home
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>

        {/* Support Hours */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 inline-block">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🕐 Support Hours
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monday - Friday: 9:00 AM - 6:00 PM (EST)
              <br />
              Saturday - Sunday: 10:00 AM - 4:00 PM (EST)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Average response time: 2-4 hours
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
