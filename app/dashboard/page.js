'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Cookies from 'js-cookie';
import BookmarkButton from '../../components/BookmarkButton';
import {
  ListChecks,
  PlaneTakeoff,
  Utensils,
  MapPin,
  Star,
  Euro,
  ChefHat,
  MessageSquareText,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null); // Initial state is null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });

  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [refreshBookmarks, setRefreshBookmarks] = useState(false);

  const [userReviews, setUserReviews] = useState([]);
  const [refreshReviews, setRefreshReviews] = useState(false);

  const [travelPlanSummary, setTravelPlanSummary] = useState(null);
  const [isTravelPlanLoading, setIsTravelPlanLoading] = useState(true);
  const [travelPlanError, setTravelPlanError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined.');
      }

      // 1. Fetch user profile data (includes lightweight reviews array from User model)
      const userResponse = await axios.get(`${apiUrl}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let fetchedUserData = null;
      if (userResponse.data.status === 'SUCCESS') {
        fetchedUserData = userResponse.data.data;
        setUserData(fetchedUserData);
        setFormData({
          name: fetchedUserData.name,
          email: fetchedUserData.email,
        });

        // 2. Fetch user bookmarks
        const bookmarksResponse = await axios.get(`${apiUrl}/user/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookmarksResponse.data.status === 'SUCCESS') {
          setBookmarkedItems(bookmarksResponse.data.data || []);
        } else {
          console.warn(
            'Failed to fetch bookmarks:',
            bookmarksResponse.data.message
          );
          setBookmarkedItems([]);
        }

        // 3. Enrich user reviews with item names/images for display
        if (fetchedUserData.reviews && fetchedUserData.reviews.length > 0) {
          const enrichedReviews = await Promise.all(
            fetchedUserData.reviews.map(async (review) => {
              let itemInfo = {
                name: 'Unknown Item',
                image: 'https://placehold.co/100x100/cccccc/333333?text=N/A',
              };
              try {
                let itemResponse;
                switch (review.itemType) {
                  case 'city':
                    itemResponse = await axios.get(
                      `${apiUrl}/public/destinations/${review.itemId}`
                    );
                    break;
                  case 'accommodation':
                    itemResponse = await axios.get(
                      `${apiUrl}/public/accommodations/${review.itemId}`
                    );
                    break;
                  case 'tour':
                    itemResponse = await axios.get(
                      `${apiUrl}/public/tours/${review.itemId}`
                    );
                    break;
                  case 'restaurant':
                    itemResponse = await axios.get(
                      `${apiUrl}/public/restaurants/${review.itemId}`
                    );
                    break;
                  default:
                    break;
                }
                if (
                  itemResponse &&
                  itemResponse.data.status === 'SUCCESS' &&
                  itemResponse.data.data
                ) {
                  itemInfo.name = itemResponse.data.data.name;
                  itemInfo.image = itemResponse.data.data.image;
                }
              } catch (itemErr) {
                console.warn(
                  `Could not fetch details for review item ${review.itemId} (${review.itemType}):`,
                  itemErr.message
                );
              }
              return {
                ...review,
                itemName: itemInfo.name,
                itemImage: itemInfo.image,
              };
            })
          );
          setUserReviews(enrichedReviews);
        } else {
          setUserReviews([]);
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
        localStorage.removeItem('token');
        Cookies.remove('token');
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
      setTravelPlanSummary(null);
      setIsTravelPlanLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/travelplan`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        Cookies.remove('token');
        router.push('/auth/login');
      }
    } finally {
      setIsTravelPlanLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
    fetchTravelPlanSummary();
  }, [
    fetchDashboardData,
    fetchTravelPlanSummary,
    refreshBookmarks,
    refreshReviews,
  ]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        { name: formData.name, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'SUCCESS') {
        setUserData(response.data.data);
        setUpdateStatus({
          message: 'Profile updated successfully!',
          type: 'success',
        });
        setIsEditing(false);
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

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const BookmarkedItemCard = ({ bookmark, onRemoveBookmark }) => {
    const getTitle = () => {
      switch (bookmark.type) {
        case 'accommodation':
          return bookmark.name || 'Accommodation';
        case 'tour':
          return bookmark.name || 'Tour';
        case 'destination':
          return bookmark.name || 'Destination';
        case 'restaurant':
          return bookmark.name || 'Restaurant';
        default:
          return 'Bookmarked Item';
      }
    };

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
                <p className="flex items-center text-gray-600 text-sm space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{bookmark.rating}</span>
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
        case 'restaurant':
          return (
            <>
              <p className="flex items-center text-gray-600 text-sm space-x-1">
                <ChefHat className="h-4 w-4 text-gray-600" />
                <span>{bookmark.cuisine || 'Various'} Cuisine</span>
              </p>
              <p className="flex items-center text-gray-600 text-sm space-x-1">
                <span>Price: {bookmark.priceRange || 'N/A'}</span>
              </p>
              {bookmark.rating && (
                <p className="flex items-center text-gray-600 text-sm space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{bookmark.rating}</span>
                </p>
              )}
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="absolute top-2 right-2 z-10">
          <BookmarkButton
            itemId={bookmark.itemId}
            bookmarkType={bookmark.bookmarkType}
            onToggle={onRemoveBookmark}
          />
        </div>
        <Link
          // --- THIS IS THE PART YOU NEED TO UPDATE ---
          href={
            bookmark.bookmarkType === 'city'
              ? `/destinations/${bookmark.slug}` // Destination uses slug
              : bookmark.bookmarkType === 'accommodation'
              ? `/accommodations/` // Accommodation uses its 'id'
              : bookmark.bookmarkType === 'tour'
              ? `/tours/` // Tour uses its 'id'
              : bookmark.bookmarkType === 'restaurant'
              ? `/restaurants/` // Restaurant uses its 'id'
              : '#' // Fallback if type is not recognized
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

  // --- NEW: Submitted Review Card Component ---
  const SubmittedReviewCard = ({ review, onDeleteReview }) => {
    const getReviewTypeDisplayName = (type) => {
      switch (type) {
        case 'city':
          return 'Destination';
        case 'accommodation':
          return 'Accommodation';
        case 'tour':
          return 'Tour';
        case 'restaurant':
          return 'Restaurant';
        default:
          return 'Item';
      }
    };

    return (
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => onDeleteReview(review.reviewId)}
            className="p-2 rounded-full shadow-md transition-colors duration-200 bg-red-500 text-white hover:bg-red-600 cursor-pointer"
            aria-label="Delete review"
            title="Delete this review"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <div className="block cursor-default">
          <div className="w-full h-36 md:h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
            <img
              src={
                review.itemImage ||
                'https://placehold.co/400x300/cccccc/333333?text=Review'
              }
              alt={`Review for ${review.itemName}`}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src =
                  'https://placehold.co/400x300/cccccc/333333?text=Review';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {review.subject}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              For:{' '}
              <span className="font-medium capitalize">
                {getReviewTypeDisplayName(review.itemType)}
              </span>{' '}
              {review.itemName && (
                <span className="font-medium"> - {review.itemName}</span>
              )}
            </p>
            <p className="text-gray-700 text-sm line-clamp-2">
              {review.message?.substring(0, 100)}...
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Submitted: {new Date(review.submittedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // --- NEW: Handle Delete Review Function ---
  const handleDeleteReview = async (reviewId) => {
    // Custom modal for confirmation instead of window.confirm
    // For now, let's use a simple state-based message to simulate a modal
    setUpdateStatus({
      message: 'Confirm deletion: Are you sure you want to delete this review?',
      type: 'confirm-delete',
      action: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setUpdateStatus({
              message: 'You must be logged in to delete reviews.',
              type: 'error',
            });
            router.push('/auth/login');
            return;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.delete(
            `${apiUrl}/user/reviews/remove/${reviewId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.status === 'SUCCESS') {
            setRefreshReviews(!refreshReviews);
            setUpdateStatus({
              message: 'Review deleted successfully!',
              type: 'success',
            });
          } else {
            throw new Error(response.data.message || 'Failed to delete review');
          }
        } catch (err) {
          console.error('Error deleting review:', err);
          setUpdateStatus({
            message:
              err.response?.data?.message ||
              err.message ||
              'An error occurred deleting review.',
            type: 'error',
          });
        }
      },
      cancelAction: () => setUpdateStatus({ message: '', type: '' }),
    });
  };

  const totalChecklistItems = travelPlanSummary?.checklist?.length || 0;
  const completedChecklistItems =
    travelPlanSummary?.checklist?.filter((item) => item.isCompleted).length ||
    0;
  const travelPlanProgress = travelPlanSummary?.progressPercentage || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Conditional rendering for the main content */}
      {!isLoading && !error && userData ? ( // Only render if data is loaded and no error
        <div className="mt-[6rem] max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header with User Icon */}
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
                    setUpdateStatus({ message: '', type: '' });
                  }}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {updateStatus.message && updateStatus.type !== 'confirm-delete' && (
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
            {updateStatus.type === 'confirm-delete' && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-600 mb-4">{updateStatus.message}</p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={updateStatus.action}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Yes, Delete
                    </Button>
                    <Button
                      onClick={updateStatus.cancelAction}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
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
                  <dd className="mt-1 text-sm text-gray-900">
                    {userData.name}
                  </dd>
                )}
              </div>

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
                  <dd className="mt-1 text-sm text-gray-900">
                    {userData.email}
                  </dd>
                )}
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Account Role
                </dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize font-medium">
                  {userData.role || 'User'}
                </dd>
              </div>

              {!isEditing && (
                <div className="sm:col-span-1 self-end">
                  <Link href="/auth/change-password">
                    <span className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)] hover:text-[var(--enterprise-lightgray)] duration-200 cursor-pointer">
                      Change Password
                    </span>
                  </Link>
                </div>
              )}
            </dl>

            {isEditing && (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: userData.name, email: userData.email });
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
                    key={bookmark.itemId}
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

          {/* Travel Planner Progress Section */}
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
                  <PlaneTakeoff className="h-6 w-6 text-blue-600" />
                </div>
                <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden mb-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${travelPlanProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-700">
                  You've completed{' '}
                  <span className="font-bold">{completedChecklistItems}</span>{' '}
                  out of{' '}
                  <span className="font-bold">{totalChecklistItems}</span>{' '}
                  steps. (
                  <span className="font-bold">{travelPlanProgress}%</span>{' '}
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

          {/* My Reviews Section */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              My Reviews
            </h2>
            {userReviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userReviews.map((review) => (
                  <SubmittedReviewCard
                    key={review.reviewId}
                    review={review}
                    onDeleteReview={handleDeleteReview}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                You haven't submitted any reviews yet.
              </p>
            )}
          </div>

          {/* Admin Controls Section */}
          {userData.role === 'admin' && (
            <div className="p-4 md:p-6">
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
                  href="/admin/add/restaurant"
                  className="px-4 py-2 rounded-md bg-[var(--enterprise-lightblue)] text-white hover:bg-[var(--enterprise-skyblue)]"
                >
                  Add Restaurant
                </Link>
                <Link
                  href="/admin/manage/restaurant"
                  className="px-4 py-2 rounded-md bg-[var(--enterprise-yellow)] text-[var(--enterprise-lightgray)] hover:bg-[var(--enterprise-lightyellow)]"
                >
                  Manage Restaurants
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
      ) : (
        // Render loading or error states outside the main content div
        <div className="min-h-screen flex items-center justify-center">
          {isLoading && (
            <div className="text-xl">Loading your dashboard...</div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center text-red-600">
              <p>Error loading dashboard:</p>
              <p>{error}</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
