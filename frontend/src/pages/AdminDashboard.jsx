import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

import Footer from '../components/Footer';
import AdminPromoter from '../components/AdminPromoter';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, loading: authLoading, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState('universities');
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isForbiddenError, setIsForbiddenError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  // Check admin status from backend profile
  useEffect(() => {
    const checkAdmin = async () => {
      if (!isLoaded || !user) {
        setIsAdmin(false);
        return;
      }
      try {
        const response = await axiosInstance.get('/me/');
        setIsAdmin(response.data.role === 'admin');
        console.log('[AdminDashboard] Backend user info:', response.data);
        console.log('[AdminDashboard] Backend role:', response.data.role);
      } catch (error) {
        setIsAdmin(false);
        console.error('[AdminDashboard] Error fetching user info:', error);
      }
    };
    checkAdmin();
  }, [user, isLoaded]);

  // Initial form state for each entity type
  const initialFormState = {
    universities: {
      name: '',
      description: '',
      location: '',
      ranking: '',
      website: '',
      image: ''
    },
    courses: {
      name: '',
      description: '',
      university: '',
      duration: '',
      fees: '',
      level: 'Undergraduate'
    },
    users: {
      username: '',
      email: '',
      password: '',
      role: 'student'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch data if user is loaded and is an admin
      if (!isLoaded || !isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        setIsForbiddenError(false);
        
        if (activeTab === 'universities') {
          const response = await axiosInstance.get(`/universities/`);
          setUniversities(response.data);
        } 
        else if (activeTab === 'courses') {
          const response = await axiosInstance.get(`/courses/`);
          setCourses(response.data);
        }
        // Fetch real users from our new endpoint
        else if (activeTab === 'users') {
          try {
            console.log('Fetching users...');
            const response = await axiosInstance.get(`/users/`);
            console.log('Users API response:', response.data);
            setUsers(response.data || []);
            setError(''); // Clear error on successful fetch
            setIsForbiddenError(false); // Clear forbidden flag
          } catch (error) {
            console.error('Error fetching users:', error);
            const errorMessage = error.response?.data?.error || error.message;
            
            // Check if it's a 403 Forbidden error
            if (error.response?.status === 403) {
              setIsForbiddenError(true);
              setError('Admin access required from backend');
            } else {
              setIsForbiddenError(false);
              setError(`Failed to load users: ${errorMessage}`);
            }
            setUsers([]);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Could not load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Reset form data and edit mode when tab changes
    setFormData(initialFormState[activeTab]);
    setShowForm(false);
    setEditMode(false);
    setEditItemId(null);
  }, [activeTab, isLoaded, isAdmin]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = async (id) => {
    console.log('[AdminDashboard] Edit clicked for ID:', id, 'Tab:', activeTab);
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'universities') {
        console.log('[AdminDashboard] Fetching university details...');
        const response = await axiosInstance.get(`/universities/${id}/`);
        console.log('[AdminDashboard] University data:', response.data);
        // Only extract editable fields, exclude read-only fields like 'id' and 'courses'
        const { id: _, courses, ...editableData } = response.data;
        setFormData(editableData);
      } 
      else if (activeTab === 'courses') {
        console.log('[AdminDashboard] Fetching course details...');
        const response = await axiosInstance.get(`/courses/${id}/`);
        console.log('[AdminDashboard] Course data:', response.data);
        // Only extract editable fields, exclude read-only fields like 'id' and 'university_name'
        const { id: _, university_name, ...editableData } = response.data;
        setFormData(editableData);
      }
      else if (activeTab === 'users') {
        console.log('[AdminDashboard] Finding user from loaded users...');
        // For users, find from the already loaded users
        const user = users.find(u => u.id === id);
        if (user) {
          console.log('[AdminDashboard] User found:', user);
          // Don't include password in edit form
          const { password, ...userData } = user;
          setFormData(userData);
        } else {
          console.error('[AdminDashboard] User not found in list');
          throw new Error('User not found');
        }
      }
      setEditMode(true);
      setEditItemId(id);
      setShowForm(true);
      setLoading(false);
      console.log('[AdminDashboard] Edit mode activated successfully');
    } catch (err) {
      console.error('[AdminDashboard] Error fetching item details:', err);
      console.error('[AdminDashboard] Error response:', err.response?.data);
      setError(`Could not load item details: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log('[AdminDashboard] Delete clicked for ID:', id, 'Tab:', activeTab);
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      console.log('[AdminDashboard] Delete cancelled by user');
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'universities') {
        console.log('[AdminDashboard] Deleting university...');
        await axiosInstance.delete(`/universities/${id}/`);
        setUniversities(universities.filter(uni => uni.id !== id));
        console.log('[AdminDashboard] University deleted successfully');
      } 
      else if (activeTab === 'courses') {
        console.log('[AdminDashboard] Deleting course...');
        await axiosInstance.delete(`/courses/${id}/`);
        setCourses(courses.filter(course => course.id !== id));
        console.log('[AdminDashboard] Course deleted successfully');
      }
      else if (activeTab === 'users') {
        // Only allow deleting if the user is not the current logged-in user
        if (user && user.id === id) {
          console.error('[AdminDashboard] Cannot delete own account');
          throw new Error('You cannot delete your own account while logged in.');
        }
        console.log('[AdminDashboard] Deleting user...');
        await axiosInstance.delete(`/users/${id}/`);
        setUsers(users.filter(u => u.id !== id));
        console.log('[AdminDashboard] User deleted successfully');
      }
      setLoading(false);
      setError('');
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('[AdminDashboard] Error deleting item:', err);
      console.error('[AdminDashboard] Error response:', err.response?.data);
      setError(`Could not delete: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[AdminDashboard] Submitting form for tab:', activeTab);
    console.log('[AdminDashboard] Form data:', formData);
    console.log('[AdminDashboard] Edit mode:', editMode, 'Edit ID:', editItemId);
    try {
      if (activeTab === 'universities') {
        if (editMode) {
          // Update existing university
          console.log('[AdminDashboard] Updating university ID:', editItemId);
          const response = await axiosInstance.put(`/universities/${editItemId}/`, formData);
          // Update the universities list with the updated item
          setUniversities(universities.map(uni => uni.id === editItemId ? response.data : uni));
        } else {
          // Create new university
          console.log('[AdminDashboard] Creating new university');
          const response = await axiosInstance.post(`/universities/`, formData);
          setUniversities([...universities, response.data]);
        }
      } 
      else if (activeTab === 'courses') {
        if (editMode) {
          // Update existing course
          const response = await axiosInstance.put(`/courses/${editItemId}/`, formData);
          // Update the courses list with the updated item
          setCourses(courses.map(course => course.id === editItemId ? response.data : course));
        } else {
          // Create new course
          const response = await axiosInstance.post(`/courses/`, formData);
          setCourses([...courses, response.data]);
        }
      }
      else if (activeTab === 'users') {
        if (editMode) {
          // Update existing user
          // Don't send password in update request
          const { password, ...userData } = formData;
          const response = await axiosInstance.put(`/users/${editItemId}/`, userData);
          // Update the users list with the updated item
          if (response.data) {
            setUsers(users.map(user => user.id === editItemId ? response.data : user));
          }
        } else {
          // For user creation, we'll use the register endpoint directly
          const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            password_confirm: formData.password, // Make sure passwords match
            role: formData.role, // Pass the role directly
            profile: {
              role: formData.role // Also include it in profile for backend processing
            }
          };
          console.log('Sending user data:', userData);
          const response = await axiosInstance.post(`/auth/register/`, userData);
          // If we get back user data, add it to our list
          if (response.data && response.data.user) {
            const newUser = response.data.user;
            setUsers([...users, newUser]);
          }
        }
      }
      // Reset form and hide it
      setFormData(initialFormState[activeTab]);
      setShowForm(false);
      setEditMode(false);
      setEditItemId(null);
      // Show success message
      setError('');
      alert(editMode ? 'Successfully updated!' : 'Successfully added!');
    } catch (err) {
      console.error('Error submitting form:', err);
      console.log('[AdminDashboard] Error response data:', err.response?.data);
      console.log('[AdminDashboard] Error status:', err.response?.status);
      setError(`Could not save data: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage universities, courses, and users
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditMode(false);
                setEditItemId(null);
                setFormData(initialFormState[activeTab]);
              }
            }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            {showForm ? '✕ Cancel' : '+ Add New'}
          </button>
        </div>
        
        {/* Tabs */}
        <div className="mt-8">
          <div className="mb-8">
            <nav className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('universities')}
                className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
                  activeTab === 'universities'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                🏛️ Universities
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
                  activeTab === 'courses'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                📚 Courses
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                👥 Users
              </button>
              <a
                href="/admin/feedback"
                className="px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105"
              >
                💬 Feedback
              </a>
            </nav>
          </div>
        </div>
        
  {/* Show admin promoter only if user is NOT admin */}
        {isLoaded && !isAdmin && (
          <div className="mt-4">
            <AdminPromoter 
              onPromotionSuccess={() => {
                // Reload the page to refresh admin status
                window.location.reload();
              }}
            />
          </div>
        )}

        {/* Show errors only for admins who encounter backend issues */}
        {isLoaded && isAdmin && error && (
          <div className="mt-4 p-6 rounded-xl shadow-xl bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Only show admin content if user is an admin */}
        {isLoaded && isAdmin && (
          <>
            {/* Add Form */}
            {showForm && (
              <div className="mt-6 p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  {editMode ? '✏️ Edit' : '➕ Add New'} {activeTab === 'universities' ? 'University' : activeTab === 'courses' ? 'Course' : 'User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
              {/* University Form */}
              {activeTab === 'universities' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        University Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter university name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={formData.location || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="4"
                      required
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ranking" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Ranking
                      </label>
                      <input
                        type="number"
                        name="ranking"
                        id="ranking"
                        value={formData.ranking || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter ranking"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      id="image"
                      value={formData.image || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}
              
              {/* Course Form */}
              {activeTab === 'courses' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Course Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter course name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="university" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        University <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="university"
                        id="university"
                        required
                        value={formData.university || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      >
                        <option value="">Select a university</option>
                        {universities.map(uni => (
                          <option key={uni.id} value={uni.id}>{uni.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="4"
                      required
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        id="duration"
                        required
                        placeholder="e.g. 4 years"
                        value={formData.duration || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fees" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Fees <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="fees"
                        id="fees"
                        required
                        value={formData.fees || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="level"
                        id="level"
                        required
                        value={formData.level || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      >
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Certificate">Certificate</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              {/* User Form */}
              {activeTab === 'users' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={formData.username || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter username"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={formData.password || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="role"
                        id="role"
                        required
                        value={formData.role || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold shadow-lg hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200"
                >
                  💾 Save
                </button>
              </div>
            </form>
          </div>
        )}
        
        {loading ? (
          <div className="mt-8 flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="mt-8">
            {activeTab === 'universities' && (
              <div className="p-6 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🏛️ Universities List
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Name</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Location</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Ranking</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Courses</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{universities.map((uni) => (
                        <tr key={uni.id} className="hover:bg-sky-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">{uni.name}</td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{uni.location}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 dark:from-sky-900/50 dark:to-cyan-900/50 text-sky-800 dark:text-sky-200 text-xs font-bold">
                              #{uni.ranking || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold">
                              {uni.courses?.length || 0} courses
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleEdit(uni.id)} 
                              className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 font-semibold mr-4 hover:scale-110 transition-all"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(uni.id)} 
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-semibold hover:scale-110 transition-all"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'courses' && (
              <div className="p-6 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  📚 Courses List
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Name</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">University</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Level</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Duration</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Fees</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">{course.name}</td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{course.university_name}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 text-xs font-bold">
                              {course.level}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold">
                              ⏱️ {course.duration}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 text-amber-800 dark:text-amber-200 text-xs font-bold">
                              💰 ${course.fees}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleEdit(course.id)} 
                              className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 font-semibold mr-4 hover:scale-110 transition-all"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(course.id)} 
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-semibold hover:scale-110 transition-all"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="p-6 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  👥 Users List
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700">
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Name</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Email</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Role</th>
                        <th className="text-left text-sm font-bold text-gray-700 dark:text-gray-200 pb-4 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user.display_name || (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email ? user.email : user.username && user.username.length > 10 ? `@${user.username.substring(0, 10)}...` : `@${user.username}`}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200' : 'bg-gradient-to-r from-sky-100 to-cyan-100 dark:from-sky-900/50 dark:to-cyan-900/50 text-sky-800 dark:text-sky-200'}`}>
                              {user.role === 'admin' ? '👑 Admin' : '👤 ' + user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleEdit(user.id)} 
                              className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200 font-semibold mr-4 hover:scale-110 transition-all"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id)} 
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-semibold hover:scale-110 transition-all"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </main>
  {/* Footer removed: now only rendered in App.jsx */}
    </div>
  );
};

export default AdminDashboard;
