import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser, useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('universities');
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

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
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        if (activeTab === 'universities') {
          const response = await axios.get(`${API_URL}/api/universities/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUniversities(response.data);
        } 
        else if (activeTab === 'courses') {
          const response = await axios.get(`${API_URL}/api/courses/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCourses(response.data);
        }
        // Fetch real users from our new endpoint
        else if (activeTab === 'users') {
          try {
            const response = await axios.get(`${API_URL}/api/users/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
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
  }, [activeTab]);

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
      const token = await getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      if (activeTab === 'universities') {
        const response = await axios.get(`${API_URL}/api/universities/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data);
      } 
      else if (activeTab === 'courses') {
        const response = await axios.get(`${API_URL}/api/courses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      const token = await getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      if (activeTab === 'universities') {
        await axios.delete(`${API_URL}/api/universities/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUniversities(universities.filter(uni => uni.id !== id));
      } 
      else if (activeTab === 'courses') {
        await axios.delete(`${API_URL}/api/courses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(courses.filter(course => course.id !== id));
      }
      else if (activeTab === 'users') {
        // Only allow deleting if the user is not the current logged-in user
        if (user && user.id === id) {
          throw new Error('You cannot delete your own account while logged in.');
        }
        await axios.delete(`${API_URL}/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      const token = await getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      if (activeTab === 'universities') {
        if (editMode) {
          // Update existing university
          const response = await axios.put(`${API_URL}/api/universities/${editItemId}/`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          // Update the universities list with the updated item
          setUniversities(universities.map(uni => uni.id === editItemId ? response.data : uni));
        } else {
          // Create new university
          const response = await axios.post(`${API_URL}/api/universities/`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setUniversities([...universities, response.data]);
        }
      } 
      else if (activeTab === 'courses') {
        if (editMode) {
          // Update existing course
          const response = await axios.put(`${API_URL}/api/courses/${editItemId}/`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          // Update the courses list with the updated item
          setCourses(courses.map(course => course.id === editItemId ? response.data : course));
        } else {
          // Create new course
          const response = await axios.post(`${API_URL}/api/courses/`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setCourses([...courses, response.data]);
        }
      }
      else if (activeTab === 'users') {
        if (editMode) {
          // Update existing user
          // Don't send password in update request
          const { password, ...userData } = formData;
          const response = await axios.put(`${API_URL}/api/users/${editItemId}/`, userData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
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
          const response = await axios.post(`${API_URL}/api/auth/register/`, userData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <span className="shadow-sm rounded-md">
              <button
                type="button"
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    // Reset edit mode when closing the form
                    setEditMode(false);
                    setEditItemId(null);
                    setFormData(initialFormState[activeTab]);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:shadow-outline-primary transition ease-in-out duration-150"
              >
                {showForm ? 'Cancel' : 'Add New'}
              </button>
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full border-gray-300 rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="universities">Universities</option>
              <option value="courses">Courses</option>
              <option value="users">Users</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('universities')}
                className={`px-3 py-2 font-medium text-sm rounded-md ${
                  activeTab === 'universities'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Universities
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-2 font-medium text-sm rounded-md ${
                  activeTab === 'courses'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 font-medium text-sm rounded-md ${
                  activeTab === 'users'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
              <a
                href="/admin/feedback"
                className="px-3 py-2 font-medium text-sm rounded-md text-gray-500 hover:text-gray-700"
              >
                Feedback
              </a>
            </nav>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editMode ? 'Edit' : 'Add New'} {activeTab === 'universities' ? 'University' : 
                       activeTab === 'courses' ? 'Course' : 'User'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* University Form */}
              {activeTab === 'universities' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">University Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={formData.location || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      required
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ranking" className="block text-sm font-medium text-gray-700">Ranking</label>
                      <input
                        type="number"
                        name="ranking"
                        id="ranking"
                        value={formData.ranking || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      name="image"
                      id="image"
                      value={formData.image || ''}
                      onChange={handleFormChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
              
              {/* Course Form */}
              {activeTab === 'courses' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Course Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-700">University</label>
                      <select
                        name="university"
                        id="university"
                        required
                        value={formData.university || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select a university</option>
                        {universities.map(uni => (
                          <option key={uni.id} value={uni.id}>{uni.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      required
                      value={formData.description || ''}
                      onChange={handleFormChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        id="duration"
                        required
                        placeholder="e.g. 4 years"
                        value={formData.duration || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Fees</label>
                      <input
                        type="number"
                        name="fees"
                        id="fees"
                        required
                        value={formData.fees || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                      <select
                        name="level"
                        id="level"
                        required
                        value={formData.level || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        required
                        value={formData.username || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={formData.password || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        name="role"
                        id="role"
                        required
                        value={formData.role || ''}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ranking
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Courses
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {universities.map((university) => (
                            <tr key={university.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{university.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{university.location}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{university.ranking || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{university.courses?.length || 0}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleEdit(university.id)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                                <button onClick={() => handleDelete(university.id)} className="text-red-600 hover:text-red-900">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'courses' && (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              University
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Level
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fees
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {courses.map((course) => (
                            <tr key={course.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{course.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{course.university_name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{course.level}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{course.duration}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">${course.fees}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleEdit(course.id)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                                <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Username
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.role === 'admin' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleEdit(user.id)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
