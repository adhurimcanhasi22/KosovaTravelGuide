'use client';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming shadcn/ui Checkbox
import { Button } from '@/components/ui/button';
import {
  Send,
  MessageSquareText,
  AlertCircle,
  CheckCircle,
  Star,
  Info,
} from 'lucide-react'; // Icons for review form

export default function SubmitReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Item details extracted from URL params
  const initialItemId = searchParams.get('itemId') || '';
  const initialItemType = searchParams.get('itemType') || '';

  // State for item details to display (fetched from backend)
  const [itemDetails, setItemDetails] = useState(null);
  const [itemDetailsLoading, setItemDetailsLoading] = useState(true);
  const [itemDetailsError, setItemDetailsError] = useState(null);

  // State for review form data
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    reasons: [], // Array to hold selected reasons
    rating: '',
  });

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Predefined reasons for the review
  const reviewReasons = [
    'Positive Experience',
    'Needs Improvement',
    'Suggestion for New Feature',
    'Issue Encountered',
    'General Feedback',
    'Other',
  ];

  // Function to fetch item details based on itemId and itemType
  const fetchItemDetails = useCallback(async () => {
    if (!initialItemId || !initialItemType) {
      setItemDetailsLoading(false);
      setItemDetailsError(
        'No item specified for review. Please use the "Leave a Review" button.'
      );
      return;
    }

    setItemDetailsLoading(true);
    setItemDetailsError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined.');
      }

      let response;
      // Fetch details based on itemType, similar to how bookmarks populate
      switch (initialItemType) {
        case 'city':
          response = await axios.get(
            `${apiUrl}/public/destinations/${initialItemId}`
          ); // Assuming a route to get city by _id
          break;
        case 'accommodation':
          response = await axios.get(
            `${apiUrl}/public/accommodations/${initialItemId}`
          ); // Uses custom 'id' field
          break;
        case 'tour':
          response = await axios.get(`${apiUrl}/public/tours/${initialItemId}`); // Uses custom 'id' field
          break;
        case 'restaurant':
          response = await axios.get(
            `${apiUrl}/public/restaurants/${initialItemId}`
          ); // Uses custom 'id' field
          break;
        default:
          throw new Error('Invalid item type provided.');
      }

      if (response.data.status === 'SUCCESS' && response.data.data) {
        setItemDetails(response.data.data);
      } else {
        throw new Error(
          response.data.message ||
            `Failed to fetch details for ${initialItemType}.`
        );
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      setItemDetailsError(
        err.response?.data?.message ||
          err.message ||
          'Could not load item details.'
      );
      setItemDetails(null);
    } finally {
      setItemDetailsLoading(false);
    }
  }, [initialItemId, initialItemType]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes
  const handleReasonChange = (reason, isChecked) => {
    setFormData((prevData) => {
      const newReasons = isChecked
        ? [...prevData.reasons, reason]
        : prevData.reasons.filter((r) => r !== reason);
      return { ...prevData, reasons: newReasons };
    });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitError('You must be logged in to submit a review.');
      setIsSubmitting(false);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      return;
    }

    if (!initialItemId || !initialItemType) {
      setSubmitError(
        'Missing item details. Please navigate from an item page.'
      );
      setIsSubmitting(false);
      return;
    }
    if (!formData.subject.trim() || !formData.message.trim()) {
      setSubmitError('Subject and message cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined.');
      }

      const response = await axios.post(
        `${apiUrl}/user/reviews/submit`, // Your new backend endpoint
        {
          itemId: initialItemId,
          itemType: initialItemType,
          subject: formData.subject,
          message: formData.message,
          reasons: formData.reasons,
          rating: formData.rating ? Number(formData.rating) : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        setSubmitSuccess(true);
        // Optionally clear form or redirect
        setFormData({
          subject: '',
          message: '',
          reasons: [],
          rating: '',
        });
        //router.push('/dashboard'); // Maybe redirect to dashboard to see their review
      } else {
        throw new Error(response.data.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          'An unexpected error occurred.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine item name for display
  const itemDisplayName =
    itemDetails?.name ||
    (initialItemType
      ? `${initialItemType} (${initialItemId})`
      : 'an unspecified item');
  const itemImage =
    itemDetails?.image ||
    'https://placehold.co/300x200/cccccc/333333?text=No+Image';

  return (
    <>
      <Head>
        <title>Submit Review | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Submit your feedback and reviews for destinations, accommodations, tours, and restaurants in Kosovo."
        />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[500px] bg-[var(--enterprise-lightGray)] flex items-center justify-center">
        <img
          src="https://www.edesk.com/wp-content/uploads/2021/04/amazon-review-tool.png"
          alt="Review Background"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/1200x350/cccccc/333333?text=Review+Background';
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg px-4 py-2 rounded">
            Submit Your Review
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md text-center px-4">
            Share your experience to help us improve and guide future travelers.
          </h5>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="section bg-gray-50 py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form Column */}
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <MessageSquareText className="w-6 h-6" />
                Your Feedback Matters
              </h2>

              {itemDetailsLoading ? (
                <p className="text-gray-600 mb-4">Loading item details...</p>
              ) : itemDetailsError ? (
                <p className="text-red-600 mb-4">{itemDetailsError}</p>
              ) : itemDetails ? (
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-center space-x-4">
                  <img
                    src={
                      itemDetails.image ||
                      'https://placehold.co/80x80/cccccc/333333?text=No+Image'
                    }
                    alt={itemDisplayName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Reviewing: {itemDisplayName}
                    </h3>
                    <p className="text-sm text-blue-700 capitalize">
                      Type: {initialItemType}
                    </p>
                    {itemDetails.location && (
                      <p className="text-sm text-blue-700">
                        Location: {itemDetails.location}
                      </p>
                    )}
                    {itemDetails.region && (
                      <p className="text-sm text-blue-700">
                        Region: {itemDetails.region}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mb-6">
                  Please select an item to review by using the "Leave a Review"
                  button on its respective page (e.g., Accommodation,
                  Destination, Tour, or Restaurant page).
                </p>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject / Title of Your Review
                  </Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Great experience at Hotel ABC!"
                    className="mt-1 block w-full"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Detailed Review / Feedback
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your experience in detail..."
                    rows={6}
                    className="mt-1 block w-full min-h-[150px]"
                    required
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Reasons for your Review (Optional)
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reviewReasons.map((reason) => (
                      <div key={reason} className="flex items-center space-x-2">
                        <Checkbox
                          id={reason}
                          checked={formData.reasons.includes(reason)}
                          onCheckedChange={(isChecked) =>
                            handleReasonChange(reason, isChecked)
                          }
                        />
                        <Label
                          htmlFor={reason}
                          className="text-sm cursor-pointer"
                        >
                          {reason}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Rating (1-5, Optional)
                  </Label>
                  <Input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="e.g., 4.5"
                    min="1"
                    max="5"
                    step="0.1"
                    className="mt-1 block w-full sm:w-1/3"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    On a scale of 1 to 5, how would you rate your experience?
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Send className="h-4 w-4 animate-pulse" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>

                {submitError && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span className="block sm:inline">{submitError}</span>
                  </div>
                )}
                {submitSuccess && (
                  <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2"
                    role="alert"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="block sm:inline">
                      Thank you! Your review has been submitted successfully and
                      will be reviewed by our staff.
                    </span>
                  </div>
                )}
              </form>
            </div>

            {/* Explanation Column */}
            <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-[var(--enterprise-blue)] flex items-center space-x-2">
                <Info className="h-6 w-6 text-[var(--enterprise-blue)]" />
                Why Your Review Matters
              </h3>
              <p className="text-gray-700 mb-4">
                We highly value your honest feedback! Your reviews help us:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Improve our recommendations and services.</li>
                <li>Identify and address any issues you encountered.</li>
                <li>
                  Ensure future travelers have the best possible experience.
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-4 text-[var(--enterprise-blue)] flex items-center space-x-2">
                <Star className="h-6 w-6 text-[var(--enterprise-blue)]" />
                Our Review Process
              </h3>
              <p className="text-gray-700 mb-4">
                To maintain the quality and integrity of our platform, all
                submitted reviews are sent directly to our staff for careful
                consideration.
              </p>
              <p className="text-gray-700 mb-4">This approach allows us to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Prevent inappropriate or spam content.</li>
                <li>Ensure constructive and helpful feedback.</li>
                <li>
                  Address any issues directly with relevant parties if
                  necessary.
                </li>
              </ul>
              <p className="text-gray-700 font-semibold">
                Rest assured, every piece of feedback is read and taken
                seriously. We are committed to providing you with the best
                travel guide for Kosovo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
