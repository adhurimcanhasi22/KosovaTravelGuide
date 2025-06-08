'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie for token access
import BookmarkButton from '../../components/BookmarkButton'; // Import the BookmarkButton component
import { ListChecks, PlaneTakeoff } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' }); // For success/error messages

  // New state for bookmarks and a trigger for refreshing them
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [refreshBookmarks, setRefreshBookmarks] = useState(false); // State to trigger re-fetch of bookmarks

  const [travelPlanSummary, setTravelPlanSummary] = useState(null);
  const [isTravelPlanLoading, setIsTravelPlanLoading] = useState(true);
  const [travelPlanError, setTravelPlanError] = useState(null);

  const fetchUserDataAndBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Fetch user profile data
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.data.status === 'SUCCESS') {
        setUserData(userResponse.data.data);
        setFormData({
          name: userResponse.data.data.name,
          email: userResponse.data.data.email,
        });

        // Fetch user bookmarks
        const bookmarksResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (bookmarksResponse.data.status === 'SUCCESS') {
          setBookmarkedItems(bookmarksResponse.data.data || []);
        } else {
          console.warn(
            'Failed to fetch bookmarks:',
            bookmarksResponse.data.message
          );
          setBookmarkedItems([]); // Clear bookmarks if fetch failed
        }
      } else {
        throw new Error(userResponse.data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Auth or fetch error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'An error occurred fetching your data.'
      );
      if (err.response?.status === 401) {
        Cookies.remove('token'); // Clear invalid token
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const fetchTravelPlanSummary = useCallback(async () => {
    setIsTravelPlanLoading(true);
    setTravelPlanError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      // Not logged in, no plan to fetch or display
      setTravelPlanSummary(null);
      setIsTravelPlanLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/travelplan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        setTravelPlanSummary(response.data.data);
      } else {
        throw new Error(
          response.data.message || 'Failed to fetch travel plan summary'
        );
      }
    } catch (err) {
      console.error('Error fetching travel plan summary:', err);
      setTravelPlanError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load travel plan summary.'
      );
      // If 401, token might be invalid, handled by main fetch, but good to be explicit here too
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login'); // Redirect to login if token is invalid
      }
    } finally {
      setIsTravelPlanLoading(false);
    }
  }, [router]);
  const totalChecklistItems = travelPlanSummary?.checklist?.length || 0;
  const completedChecklistItems =
    travelPlanSummary?.checklist?.filter((item) => item.isCompleted).length ||
    0;
  const travelPlanProgress = travelPlanSummary?.progressPercentage || 0;

  useEffect(() => {
    fetchTravelPlanSummary();
  }, [fetchTravelPlanSummary]);

  useEffect(() => {
    fetchUserDataAndBookmarks();
  }, [fetchUserDataAndBookmarks, refreshBookmarks]); // Re-fetch when refreshBookmarks is toggled

  // --- Handle Edit Form Changes ---
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handle Profile Update Submission ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateStatus({ message: 'Updating...', type: 'info' });
    const token = localStorage.getItem('token'); // Get token from localStorage
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

  // --- Bookmarked Item Card Component ---
  // This component will render each bookmarked item in a simplified card format
  const BookmarkedItemCard = ({ bookmark, onRemoveBookmark }) => {
    // Determine the title based on bookmark type
    const getTitle = () => {
      switch (bookmark.type) {
        case 'accommodation':
          return bookmark.name || 'Accommodation';
        case 'tour':
          return bookmark.name || 'Tour';
        case 'destination':
          return bookmark.name || 'Destination';
        default:
          return 'Bookmarked Item';
      }
    };

    // Determine specific details to show based on type
    const renderDetails = () => {
      switch (bookmark.type) {
        case 'accommodation':
          return (
            <>
              <p className="text-gray-600 text-sm">
                €{bookmark.price}/night | {bookmark.location}
              </p>
              <p className="text-gray-600 text-sm capitalize">
                Type: {bookmark.type}
              </p>
              {bookmark.rating && (
                <p className="text-gray-600 text-sm">
                  Rating: {bookmark.rating} ★
                </p>
              )}
            </>
          );
        case 'tour':
          return (
            <>
              <p className="text-gray-600 text-sm">
                From €{bookmark.price}/person | {bookmark.location}
              </p>
              <p className="text-gray-600 text-sm">
                Duration: {bookmark.duration} | Group: {bookmark.groupSize}
              </p>
            </>
          );
        case 'destination':
          return (
            <p className="text-gray-600 text-sm">
              {bookmark.description?.substring(0, 70)}...
            </p>
          );
        default:
          return null;
      }
    };

    return (
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
        {/* Bookmark button positioned on the top right */}
        <div className="absolute top-2 right-2 z-10">
          <BookmarkButton
            itemId={bookmark.itemId}
            bookmarkType={bookmark.bookmarkType} // Use original bookmarkType from DB
            onToggle={onRemoveBookmark} // Callback to trigger refresh on removal
          />
        </div>
        <Link
          href={
            bookmark.bookmarkType === 'city' && bookmark.slug
              ? `/${bookmark.slug}`
              : bookmark.type === 'tour'
              ? `/tours/#detail-${bookmark.itemId}`
              : bookmark.type === 'accommodation'
              ? `/accommodations/#detail-${bookmark.itemId}`
              : bookmark.route || '#'
          }
          className="block cursor-pointer"
        >
          <div className="w-full h-36 md:h-48 overflow-hidden bg-gray-200">
            <img
              src={
                bookmark.image ||
                'https://placehold.co/400x300/cccccc/333333?text=No+Image'
              }
              alt={getTitle()}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src =
                  'https://placehold.co/400x300/cccccc/333333?text=No+Image';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {getTitle()}
            </h3>
            {renderDetails()}
          </div>
        </Link>
      </div>
    );
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

        {/* Bookmarks Section */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            My Bookmarks
          </h2>
          {bookmarkedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedItems.map((bookmark) => (
                <BookmarkedItemCard
                  key={bookmark.itemId} // Using itemId as key as it's unique for each type
                  bookmark={bookmark}
                  onRemoveBookmark={() =>
                    setRefreshBookmarks(!refreshBookmarks)
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              You haven't bookmarked any items yet.
            </p>
          )}
        </div>

        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Travel Planner Progress
          </h2>
          {isTravelPlanLoading ? (
            <p className="text-sm text-gray-600">
              Loading travel plan progress...
            </p>
          ) : travelPlanError ? (
            <div className="text-sm text-red-600">
              <p>Error: {travelPlanError}</p>
              <button
                onClick={fetchTravelPlanSummary}
                className="text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : travelPlanSummary ? (
            <Link
              href="/travel-planner"
              className="block p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ListChecks className="h-6 w-6 text-blue-600" />
                  <h3 className="text-base font-semibold text-blue-800">
                    Your Trip Preparation
                  </h3>
                </div>
                <PlaneTakeoff className="h-6 w-6 text-blue-600" />{' '}
                {/* A nice icon for travel */}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${travelPlanProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700">
                You've completed{' '}
                <span className="font-bold">{completedChecklistItems}</span> out
                of <span className="font-bold">{totalChecklistItems}</span>{' '}
                steps. (<span className="font-bold">{travelPlanProgress}%</span>{' '}
                complete)
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Click to view/manage your full travel plan.
              </p>
            </Link>
          ) : (
            <p className="text-sm text-gray-600">
              No travel plan found. Start planning your trip to Kosovo!
              <Link
                href="/travel-planner"
                className="text-blue-600 hover:underline ml-1"
              >
                Go to Planner
              </Link>
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
                href="/admin/manage/tour"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)]"
              >
                Manage Tours
              </Link>
              <Link
                href="/admin/add/travel-tips"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-lightblue)] text-white hover:bg-[var(--enterprise-skyblue)]"
              >
                Add Travel Tips
              </Link>
              <Link
                href="/admin/manage/travel-tips"
                className="px-4 py-2 rounded-md bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)]"
              >
                Manage Travel Tips
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
