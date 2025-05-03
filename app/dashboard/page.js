'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios'; // Import axios

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
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
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header with User Icon and Logout */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl md:text-3xl font-bold">
              {getUserInitial(userData.name)}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Welcome, {userData.name}!
              </h1>
              <p className="text-sm text-blue-100">Your personal dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Profile Information
          </h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
            </div>
            <div className="sm:col-span-2 mt-2">
              <Link href="/auth/forgot-password">
                <span className="px-4 py-2 rounded-md text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 cursor-pointer">
                  Change Password
                </span>
              </Link>
            </div>
          </dl>
        </div>

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
      </div>
    </div>
  );
}
