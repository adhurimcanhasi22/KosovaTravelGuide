'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' }); // For success/error messages

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return; // Stop execution if no token
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'SUCCESS') {
          setUserData(response.data.data);
          // Initialize form data when user data is fetched
          setFormData({
            name: response.data.data.name,
            email: response.data.data.email,
          });
        } else {
          // Handle backend error message
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Auth or fetch error:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'An error occurred fetching your data.'
        );
        // If token is invalid (e.g., 401 Unauthorized), clear it and redirect
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        } else {
          // Keep loading state false for other errors to show the error message
          setIsLoading(false);
        }
        // No need for finally block here if setting loading in error cases
        return; // Stop if error occurred
      }
      // Only set loading false on success
      setIsLoading(false);
    };

    fetchUserData();
  }, [router]);

  // --- Handle Edit Form Changes ---
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handle Profile Update Submission ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateStatus({ message: 'Updating...', type: 'info' });
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        { name: formData.name, email: formData.email }, // Send updated data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        setUserData(response.data.data); // Update local state with new data from backend
        setUpdateStatus({
          message: 'Profile updated successfully!',
          type: 'success',
        });
        setIsEditing(false); // Exit editing mode on success
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      setUpdateStatus({
        message:
          err.response?.data?.message ||
          err.message ||
          'An error occurred updating profile.',
        type: 'error',
      });
    }
  };

  // --- Helper function for User Icon ---
  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>Error loading dashboard:</p>
        <p>{error}</p>
        <button
          onClick={() => router.push('/auth/login')} // Go back to login on error
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!userData) {
    // This case should ideally be covered by loading/error states, but as a fallback
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user data available. Redirecting...
      </div>
    );
  }

  // --- Main Dashboard Content ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mt-[6rem] max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header with User Icon and Logout */}
        <div className="bg-gradient-to-r from-[var(--enterprise-lightblue)] to-[var(--enterprise-skyblue)] p-4 sm:p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-[var(--enterprise-blue)] text-2xl md:text-3xl font-bold">
              {getUserInitial(userData.name)}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Welcome, {userData.name}!
              </h1>
              <p className="text-sm text-blue-100">Your personal dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Section - Editable */}
        <form
          onSubmit={handleUpdateProfile}
          className="p-4 md:p-6 border-b border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setUpdateStatus({ message: '', type: '' }); // Clear status on edit
                }}
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Display Update Status Message */}
          {updateStatus.message && (
            <div
              className={`p-2 mb-3 rounded text-sm ${
                updateStatus.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : updateStatus.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {updateStatus.message}
            </div>
          )}

          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {/* Name Field */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Full name
              </dt>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <dd className="mt-1 text-sm text-gray-900">{userData.name}</dd>
              )}
            </div>

            {/* Email Field */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Email address
              </dt>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
              )}
            </div>

            {/* Role Display */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Account Role
              </dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize font-medium">
                {userData.role || 'User'}
              </dd>
            </div>

            {/* Change Password Link/Button (Only show when not editing other fields) */}
            {!isEditing && (
              <div className="sm:col-span-1 self-end">
                {' '}
                {/* Align with role field */}
                <Link href="/auth/change-password">
                  <span className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)] hover:text-[var(--enterprise-lightgray)] duration-200 cursor-pointer">
                    Change Password
                  </span>
                </Link>
              </div>
            )}
          </dl>

          {/* Edit Mode Buttons */}
          {isEditing && (
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: userData.name, email: userData.email }); // Reset form on cancel
                  setUpdateStatus({ message: '', type: '' });
                }}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>

        {/* Bookmarks Section (Placeholder) */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            My Bookmarks
          </h2>
          {userData.bookmarks && userData.bookmarks.length > 0 ? (
            <ul>
              {userData.bookmarks.map((bookmark) => (
                <li key={bookmark._id || bookmark}>
                  {' '}
                  {/* Use _id if populated, otherwise assume it's just the ID */}
                  {/* Replace with actual bookmark display logic - e.g., Link to place */}
                  Bookmark ID:{' '}
                  {typeof bookmark === 'object' ? bookmark._id : bookmark}
                  {/* {typeof bookmark === 'object' ? bookmark.name : 'Loading...'} */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              You haven't bookmarked any places yet.
            </p>
          )}
        </div>

        {/* Reviews Section (Placeholder) */}
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            My Reviews
          </h2>
          {userData.reviews && userData.reviews.length > 0 ? (
            <ul>
              {userData.reviews.map((review) => (
                <li key={review._id || review}>
                  {' '}
                  {/* Use _id if populated, otherwise assume it's just the ID */}
                  {/* Replace with actual review display logic */}
                  Review ID: {typeof review === 'object' ? review._id : review}
                  {/* Rating: {typeof review === 'object' ? review.rating : '...'} */}
                  {/* Comment: {typeof review === 'object' ? review.comment : '...'} */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">
              You haven't written any reviews yet.
            </p>
          )}
        </div>
        {userData.role === 'admin' && (
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Admin Controls
            </h2>
            <p className="text-gray-700 mb-2">Manage website content:</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/add/accommodation"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-lightblue)] text-white hover:bg-[var(--enterprise-skyblue)]"
              >
                Add Accommodation
              </Link>
              <Link
                href="/admin/manage/accommodation"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)]"
              >
                Manage Accommodations
              </Link>
              <Link
                href="/admin/add/destination"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-lightblue)] text-white hover:bg-[var(--enterprise-skyblue)]"
              >
                Add Destination
              </Link>
              <Link
                href="/admin/manage/destination"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)]"
              >
                Manage Destinations
              </Link>
              <Link
                href="/admin/add/tour"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-lightblue)] text-white hover:bg-[var(--enterprise-skyblue)]"
              >
                Add Tour
              </Link>
              <Link
                href="/admin/manage/tours"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)]"
              >
                Manage Tours
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
