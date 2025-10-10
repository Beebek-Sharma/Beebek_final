import React, { useState } from 'react';

import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, you would send this data to your backend
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="max-w-5xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-github-darkText mb-8">Contact Us</h1>
        <div className="space-y-8">
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <div className="md:flex">
              {/* Contact Information Section */}
              <div className="bg-primary-700 text-white p-8 md:w-1/3 rounded-xl md:rounded-r-none">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Our Office</h3>
                  <p className="mb-1">Dharan Clock Tower</p>
                  <p className="mb-1">Dharan</p>
                  <p>Nepal</p>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
                  <p className="mb-1">Email: info@educonnect.com</p>
                  <p className="mb-1">Phone: (555) 123-4567</p>
                  <p>Support Hours: 9AM - 5PM, Mon-Fri</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {/* ...existing social links... */}
                    <a href="https://www.facebook.com/nishan.phuyal.0" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-200">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://x.com/Sosuke7_Aizen" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-200">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/np._.here" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-200">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/samyambasnet001" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-200">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              {/* Contact Form Section */}
              <div className="p-8 md:w-2/3 rounded-xl md:rounded-l-none">
                {submitted ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-github-darkText">Thank You!</h2>
                    <p className="mt-2 text-gray-600 dark:text-github-darkText">Your message has been received. We'll get back to you as soon as possible.</p>
                    <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow dark:border-github-darkBorder-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" onClick={() => setSubmitted(false)}>Send Another Message</button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* ...existing form fields... */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow dark:border-github-darkBorder-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow dark:border-github-darkBorder-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Subject</label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow dark:border-github-darkBorder-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Message</label>
                        <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow dark:border-github-darkBorder-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
                      </div>
                      <div>
                        <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow dark:border-github-darkBorder-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Send Message</button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-6">Our Location</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14204.848428896799!2d87.28475509999999!3d26.809393499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef419934314a0f%3A0x7e972d70469844fa!2sDharan%20Clock%20Tower!5e0!3m2!1sen!2snp!4v1694064621816!5m2!1sen!2snp" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Dharan Clock Tower Location" className="rounded-lg"></iframe>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Visit Us</h3>
              <p className="text-gray-600 dark:text-github-darkText mt-2">Dharan Clock Tower, Dharan, Nepal</p>
              <div className="mt-2">
                <a href="https://www.google.com/maps/place/Dharan+Clock+Tower/@26.8093935,87.2847551,2239m/data=!3m1!1e3!4m15!1m8!3m7!1s0x39ef419fc7271c1d:0x1d1300367590c002!2sDharan,+Nepal!3b1!8m2!3d26.806497!4d87.2847086!16zL20vMDRud3cz!3m5!1s0x39ef419934314a0f:0x7e972d70469844fa!8m2!3d26.8117069!4d87.2852886!16s%2Fm%2F05c36vb!5m1!1e4?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-800">
                  <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  View on Google Maps
                </a>
              </div>
            </div>
          </section>
          <section className="p-8 rounded-xl shadow-md bg-white dark:bg-github-darkAccent w-full max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-darkText mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">How quickly do you respond to inquiries?</h3>
                <p className="mt-2 text-gray-600 dark:text-github-darkText">We aim to respond to all inquiries within 24-48 hours during business days.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Can I visit your office in person?</h3>
                <p className="mt-2 text-gray-600 dark:text-github-darkText">Yes, you're welcome to visit our office during business hours. We recommend scheduling an appointment beforehand.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">Do you offer support for technical issues?</h3>
                <p className="mt-2 text-gray-600 dark:text-github-darkText">Yes, our technical support team is available Monday through Friday from 9 AM to 5 PM to assist with any platform-related issues.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-github-darkText">How can universities get listed on your platform?</h3>
                <p className="mt-2 text-gray-600 dark:text-github-darkText">Universities interested in being featured on our platform can reach out through this contact form or email us directly at partnerships@educonnect.com.</p>
              </div>
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

export default ContactUs;
