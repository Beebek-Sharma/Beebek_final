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
    try {
      setLoading(true);
      if (activeTab === 'universities') {
        const response = await axiosInstance.get(`/universities/${id}/`);
        setFormData(response.data);
      } 
      else if (activeTab === 'courses') {
        const response = await axiosInstance.get(`/courses/${id}/`);
        setFormData(response.data);
      }
      else if (activeTab === 'users') {
        // For users, find from the already loaded users
        const user = users.find(u => u.id === id);
        if (user) {
          // Don't include password in edit form
          const { password, ...userData } = user;
          setFormData(userData);
        }
      }
      setEditMode(true);
      setEditItemId(id);
      setShowForm(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError('Could not load item details. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      if (activeTab === 'universities') {
        await axiosInstance.delete(`/universities/${id}/`);
        setUniversities(universities.filter(uni => uni.id !== id));
      } 
      else if (activeTab === 'courses') {
        await axiosInstance.delete(`/courses/${id}/`);
        setCourses(courses.filter(course => course.id !== id));
      }
      else if (activeTab === 'users') {
        // Only allow deleting if the user is not the current logged-in user
        if (user && user.id === id) {
          throw new Error('You cannot delete your own account while logged in.');
        }
        await axiosInstance.delete(`/users/${id}/`);
        setUsers(users.filter(u => u.id !== id));
      }
      setLoading(false);
      setError('');
      alert('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Could not delete: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'universities') {
        if (editMode) {
          // Update existing university
          const response = await axiosInstance.put(`/universities/${editItemId}/`, formData);
          // Update the universities list with the updated item
          setUniversities(universities.map(uni => uni.id === editItemId ? response.data : uni));
        } else {
          // Create new university
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
      setError(`Could not save data: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-github-dark flex flex-col">
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
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
            className="px-6 py-2 rounded-lg bg-[#4f46e5] text-white font-semibold shadow hover:bg-[#4338ca] transition-all"
          >
            {showForm ? 'Cancel' : 'Add New'}
          </button>
        </div>
        
        <div className="mt-6">
          <div className="mb-8">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('universities')}
                className={`px-5 py-2 rounded-full font-semibold shadow transition-all ${
                  activeTab === 'universities'
                    ? 'bg-[#4f46e5] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:hover:bg-github-darkBorder'
                }`}
              >
                Universities
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-5 py-2 rounded-full font-semibold shadow transition-all ${
                  activeTab === 'courses'
                    ? 'bg-[#4f46e5] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:hover:bg-github-darkBorder'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-5 py-2 rounded-full font-semibold shadow transition-all ${
                  activeTab === 'users'
                    ? 'bg-[#4f46e5] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#eef2ff] dark:hover:bg-github-darkBorder'
                }`}
              >
                Users
              </button>
              <a
                href="/admin/feedback"
                className="px-5 py-2 rounded-full font-semibold shadow transition-all bg-white text-gray-700 hover:bg-[#eef2ff]"
              >
                Feedback
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
          <div className="mt-4 p-6 rounded-xl shadow-md bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-400">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Only show admin content if user is an admin */}
        {isLoaded && isAdmin && (
          <>
            {/* Add Form */}
            {showForm && (
              <div className="mt-6 p-6 rounded-2xl shadow bg-white">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editMode ? 'Edit' : 'Add New'} {activeTab === 'universities' ? 'University' : activeTab === 'courses' ? 'Course' : 'User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
              {/* University Form */}
              {activeTab === 'universities' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">University Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Location</label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={formData.location || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      required
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ranking" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Ranking</label>
                      <input
                        type="number"
                        name="ranking"
                        id="ranking"
                        value={formData.ranking || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Website</label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      id="image"
                      value={formData.image || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    />
                  </div>
                </>
              )}
              
              {/* Course Form */}
              {activeTab === 'courses' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Course Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">University</label>
                      <select
                        name="university"
                        id="university"
                        required
                        value={formData.university || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      >
                        <option value="">Select a university</option>
                        {universities.map(uni => (
                          <option key={uni.id} value={uni.id}>{uni.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      required
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        id="duration"
                        required
                        placeholder="e.g. 4 years"
                        value={formData.duration || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fees" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Fees</label>
                      <input
                        type="number"
                        name="fees"
                        id="fees"
                        required
                        value={formData.fees || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Level</label>
                      <select
                        name="level"
                        id="level"
                        required
                        value={formData.level || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
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
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Username</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={formData.username || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={formData.password || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-github-darkText">Role</label>
                      <select
                        name="role"
                        id="role"
                        required
                        value={formData.role || ''}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mr-3 px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#4f46e5] text-white font-semibold shadow hover:bg-[#4338ca] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
        
        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="mt-8">
            {activeTab === 'universities' && (
              <div className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-lightText transition-colors duration-300 w-full max-w-none">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">University</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Name</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Location</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Ranking</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Courses</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-github-darkBorder">
                      {universities.map((uni) => (
                        <tr key={uni.id}>
                          <td className="py-3 text-base font-semibold text-gray-900 dark:text-white">{uni.name}</td>
                          <td className="py-3 text-base text-gray-700 dark:text-white">{uni.location}</td>
                          <td className="py-3">
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-github-darkBorder text-blue-800 dark:text-white text-xs font-semibold">{uni.ranking || 'N/A'}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-github-darkBorder text-gray-800 dark:text-white text-xs font-semibold">{uni.courses?.length || 0}</span>
                          </td>
                          <td className="py-3">
                            <button onClick={() => handleEdit(uni.id)} className="text-[#4f46e5] hover:text-[#4338ca] font-semibold mr-4 dark:text-blue-400 dark:hover:text-blue-200">Edit</button>
                            <button onClick={() => handleDelete(uni.id)} className="text-red-600 hover:text-red-900 font-semibold dark:text-red-400 dark:hover:text-red-200">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'courses' && (
              <div className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-lightText transition-colors duration-300 w-full max-w-none">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Course</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Name</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">University</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Level</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Duration</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Fees</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-github-darkBorder">
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="py-3 text-base font-semibold text-gray-900 dark:text-white">{course.name}</td>
                          <td className="py-3 text-base text-gray-700 dark:text-white">{course.university_name}</td>
                          <td className="py-3">
                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-github-darkBorder text-green-800 dark:text-white text-xs font-semibold">{course.level}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-github-darkBorder text-gray-800 dark:text-white text-xs font-semibold">{course.duration}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-github-darkBorder text-blue-800 dark:text-white text-xs font-semibold">${course.fees}</span>
                          </td>
                          <td className="py-3">
                            <button onClick={() => handleEdit(course.id)} className="text-[#4f46e5] hover:text-[#4338ca] font-semibold mr-4 dark:text-blue-400 dark:hover:text-blue-200">Edit</button>
                            <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900 font-semibold dark:text-red-400 dark:hover:text-red-200">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="p-6 rounded-xl shadow-md bg-github-lightAccent dark:bg-github-darkAccent text-github-lightText dark:text-github-lightText transition-colors duration-300 w-full max-w-none">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Name</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Email</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Role</th>
                        <th className="text-left text-base font-semibold text-gray-600 dark:text-white pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-github-darkBorder">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="py-3 text-base font-semibold text-gray-900 dark:text-white">
                            {user.display_name || (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username)}
                            <div className="text-xs text-gray-500 dark:text-white">
                              {user.email ? user.email : user.username && user.username.length > 10 ? `@${user.username.substring(0, 10)}...` : `@${user.username}`}
                            </div>
                          </td>
                          <td className="py-3 text-base text-gray-700 dark:text-white">{user.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-green-100 dark:bg-github-darkBorder text-green-800 dark:text-white' : 'bg-blue-100 dark:bg-github-darkBorder text-blue-800 dark:text-white'}`}>{user.role}</span>
                          </td>
                          <td className="py-3">
                            <button onClick={() => handleEdit(user.id)} className="text-[#4f46e5] hover:text-[#4338ca] font-semibold mr-4 dark:text-blue-400 dark:hover:text-blue-200">Edit</button>
                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-semibold dark:text-red-400 dark:hover:text-red-200">Delete</button>
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
