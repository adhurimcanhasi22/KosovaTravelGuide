'use client';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react'; // Using MessageSquarePlus for review icon

export default function ReviewButton({ itemId, itemType }) {
  const router = useRouter();

  const handleLeaveReview = () => {
    // Construct the URL to the review submission page with item details as query params
    const reviewPageUrl = `/submit-review?itemId=${itemId}&itemType=${itemType}`;
    router.push(reviewPageUrl);
  };

  return (
    <button
      onClick={handleLeaveReview}
      className={`p-2 rounded-full shadow-md transition-colors duration-200
        bg-white text-gray-400 hover:bg-blue-500 hover:text-white cursor-pointer
      `}
      aria-label="Leave a review"
      title="Leave a review" // Tooltip for better UX
    >
      <MessageSquarePlus className="h-5 w-5 fill-current" />
    </button>
  );
}
