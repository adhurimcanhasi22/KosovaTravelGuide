'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bookmark } from 'lucide-react'; // Using Star icon for bookmark

export default function BookmarkButton({ itemId, bookmarkType, onToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check if the item is already bookmarked by the current user
  const checkBookmarkStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      // User is not logged in, so item cannot be bookmarked for them
      setIsBookmarked(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/bookmarks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        const bookmarks = response.data.data || [];
        const found = bookmarks.some(
          (bookmark) =>
            bookmark.itemId === itemId && bookmark.bookmarkType === bookmarkType
        );
        setIsBookmarked(found);
      } else {
        throw new Error(response.data.message || 'Failed to fetch bookmarks');
      }
    } catch (err) {
      console.error('Error checking bookmark status:', err);
      // If error is 401, token might be invalid, treat as not logged in
      if (err.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        setIsBookmarked(false);
      } else {
        setError(err.message || 'Failed to check bookmark status');
      }
    } finally {
      setIsLoading(false);
    }
  }, [itemId, bookmarkType]);

  useEffect(() => {
    checkBookmarkStatus();
  }, [checkBookmarkStatus]);

  // Function to toggle bookmark status (add/remove)
  const handleToggleBookmark = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please log in to bookmark items.');
      setIsLoading(false);
      // Optionally redirect to login, but let parent handle it
      return;
    }

    const endpoint = isBookmarked // isBookmarked means the item IS currently bookmarked
      ? `${process.env.NEXT_PUBLIC_API_URL}/user/bookmarks/remove` // So, we want to REMOVE it
      : `${process.env.NEXT_PUBLIC_API_URL}/user/bookmarks/add`; // Or, we want to ADD it

    const method = isBookmarked ? 'DELETE' : 'POST'; // Dynamically set the HTTP method

    try {
      const response = await axios({
        // Use axios generic method to allow dynamic 'method'
        method: method, // Pass the dynamically determined method
        url: endpoint,
        data: { itemId, bookmarkType }, // Send data in the body for POST/DELETE
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'SUCCESS') {
        setIsBookmarked(!isBookmarked); // Toggle the state
        if (onToggle) {
          onToggle(!isBookmarked); // Inform parent about the change
        }
      } else {
        throw new Error(response.data.message || 'Failed to toggle bookmark');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setError(err.message || 'Failed to toggle bookmark.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
      }
    } finally {
      // Assuming setIsLoading is managed here
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`p-2 rounded-full shadow-md transition-colors duration-200
        ${isBookmarked ? 'bg-yellow-400 text-white' : 'bg-white text-gray-400'}
        ${
          isLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-yellow-500 hover:text-white cursor-pointer'
        }
      `}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <Bookmark className="h-5 w-5 fill-current" />
      {/* Optionally display loading/error state if needed */}
      {/* {isLoading && <span className="ml-2 text-sm">Loading...</span>} */}
      {/* {error && <span className="ml-2 text-sm text-red-600">{error}</span>} */}
    </button>
  );
}
