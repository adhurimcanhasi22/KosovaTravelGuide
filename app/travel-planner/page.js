'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, RefreshCcw, Plane, Car } from 'lucide-react'; // Icons for checklist and sections
import { jwtDecode } from 'jwt-decode'; // For decoding JWT to check login status

export default function TravelPlannerPage() {
  const router = useRouter();
  const [travelPlan, setTravelPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For actions like updating/resetting

  // Define the hardcoded checklist items for display.
  // These IDs must match the 'id' field in your backend's defaultChecklistItems.
  const checklistItems = [
    {
      id: 'documents-passport-expiry',
      label: 'Check passport/ID expiry and validity',
      category: 'Documents',
    },
    {
      id: 'documents-visa-requirements',
      label: 'Research visa requirements for Kosovo',
      category: 'Documents',
    },
    {
      id: 'documents-travel-insurance',
      label: 'Arrange travel insurance',
      category: 'Documents',
    },
    {
      id: 'packing-essentials-summer',
      label: 'Pack light clothing, swimwear (Summer: June-Sept)',
      category: 'Packing',
    },
    {
      id: 'packing-essentials-autumn',
      label: 'Pack layers, light jacket (Autumn: Oct-Nov)',
      category: 'Packing',
    },
    {
      id: 'packing-essentials-winter',
      label: 'Pack warm clothing, heavy coat, snow boots (Winter: Dec-Mar)',
      category: 'Packing',
    },
    {
      id: 'packing-essentials-spring',
      label: 'Pack light layers, umbrella (Spring: Apr-May)',
      category: 'Packing',
    },
    {
      id: 'health-vaccinations',
      label: 'Check recommended vaccinations',
      category: 'Health',
    },
    {
      id: 'health-medication',
      label: 'Prepare essential personal medication',
      category: 'Health',
    },
    {
      id: 'transportation-flights',
      label: 'Book flights to Kosovo',
      category: 'Transportation',
    },
    {
      id: 'transportation-local',
      label: 'Plan local transportation (car rental/taxis)',
      category: 'Transportation',
    },
    {
      id: 'itinerary-tours',
      label: 'Consider booking a planned tour from our list',
      category: 'Itinerary',
    },
    {
      id: 'itinerary-destinations-accommodation',
      label: 'Choose destinations and book accommodation',
      category: 'Itinerary',
    },
    {
      id: 'finance-currency',
      label: 'Familiarize with local currency (Euro)',
      category: 'Finance',
    },
    {
      id: 'finance-budget',
      label: 'Set a daily budget for the trip',
      category: 'Finance',
    },
    {
      id: 'communication-sim-card',
      label: 'Consider local SIM card or roaming plan',
      category: 'Communication',
    },
    {
      id: 'communication-emergency-contacts',
      label: 'Save emergency contacts and embassy details',
      category: 'Communication',
    },
  ];

  // Function to fetch or create the travel plan
  const fetchTravelPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
      try {
        // Decode token to verify its validity and get user data (optional, but good for validation)
        const decoded = jwtDecode(token);
        // If token is expired, remove it and treat as not logged in
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/travelplan`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'SUCCESS') {
          // Ensure the frontend checklist display matches the backend's default list
          // and merge completion status from the fetched plan.
          const mergedChecklist = checklistItems.map((defaultItem) => {
            const foundItem = response.data.data.checklist.find(
              (planItem) => planItem.id === defaultItem.id
            );
            return {
              ...defaultItem,
              isCompleted: foundItem ? foundItem.isCompleted : false,
            };
          });

          setTravelPlan({
            ...response.data.data,
            checklist: mergedChecklist,
          });
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch travel plan'
          );
        }
      } catch (err) {
        console.error('Error fetching travel plan:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'An error occurred fetching your travel plan.'
        );
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      // For logged out users, we can initialize a dummy plan for display
      // or simply leave travelPlan as null, but it's good to show the full checklist.
      setTravelPlan({
        name: 'Guest Travel Plan',
        progressPercentage: 0,
        checklist: checklistItems.map((item) => ({
          ...item,
          isCompleted: false,
        })),
      });
    }
  }, [router]); // Added router to dependencies

  useEffect(() => {
    fetchTravelPlan();
  }, [fetchTravelPlan]);

  // Handle checklist item toggle
  const handleChecklistItemToggle = useCallback(
    async (itemId, currentStatus) => {
      if (!isLoggedIn) {
        alert('Please log in to save your travel plan progress.'); // Use a custom modal instead of alert in production
        return;
      }
      setIsProcessing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setIsProcessing(false);
        router.push('/auth/login');
        return;
      }

      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/user/travelplan/${itemId}`,
          { isCompleted: !currentStatus }, // Toggle the status
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'SUCCESS') {
          // Update local state with the new plan and progress
          const mergedChecklist = checklistItems.map((defaultItem) => {
            const foundItem = response.data.data.checklist.find(
              (planItem) => planItem.id === defaultItem.id
            );
            return {
              ...defaultItem,
              isCompleted: foundItem ? foundItem.isCompleted : false,
            };
          });

          setTravelPlan({
            ...response.data.data,
            checklist: mergedChecklist,
          });
        } else {
          throw new Error(
            response.data.message || 'Failed to update checklist item'
          );
        }
      } catch (err) {
        console.error('Error updating checklist item:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to update plan. Please try again.'
        );
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          router.push('/auth/login');
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [isLoggedIn, router]
  );

  // Handle resetting the travel plan
  const handleResetPlan = useCallback(async () => {
    if (!isLoggedIn) {
      alert('Please log in to manage your travel plan.'); // Use a custom modal
      return;
    }
    if (
      !window.confirm(
        'Are you sure you want to reset your travel plan? This cannot be undone.'
      )
    ) {
      // Use a custom modal
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsProcessing(false);
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/user/travelplan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'SUCCESS') {
        // After deleting, fetch a new, empty plan
        await fetchTravelPlan(); // Re-fetch to get the newly created (default) plan
      } else {
        throw new Error(response.data.message || 'Failed to reset travel plan');
      }
    } catch (err) {
      console.error('Error resetting travel plan:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to reset plan. Please try again.'
      );
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/auth/login');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isLoggedIn, fetchTravelPlan, router]);

  // Group checklist items by category using current travelPlan data
  const groupedChecklist =
    travelPlan?.checklist?.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {}) || {};

  // Render Logic
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-700">Loading your travel plan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 bg-gray-100 p-4">
        <p className="text-lg font-semibold">Error loading travel plan:</p>
        <p className="text-center mt-2">{error}</p>
        <button
          onClick={() =>
            isLoggedIn ? fetchTravelPlan() : router.push('/auth/login')
          }
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {isLoggedIn ? 'Try Again' : 'Go to Login'}
        </button>
      </div>
    );
  }

  if (!travelPlan) {
    // This case should ideally be covered by isLoading/error, but as a fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">No travel plan data available.</p>
      </div>
    );
  }

  // Calculate current progress for display
  const currentProgress = travelPlan.progressPercentage || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mt-20 max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[var(--enterprise-skyblue)] to-[var(--enterprise-lightblue)] p-6 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Kosovo Travel Planner
          </h1>
          <p className="text-lg opacity-90">
            Plan your perfect trip step-by-step!
          </p>
        </div>
        {/* User Status / Login Prompt */}
        {!isLoggedIn && (
          <div className="bg-yellow-100 text-yellow-800 p-4 text-center border-b border-yellow-200">
            <p className="font-semibold">You are not logged in.</p>
            <p className="text-sm mt-1">
              Log in to save your progress and access personalized features.
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline ml-2"
              >
                Log In Here
              </Link>
            </p>
          </div>
        )}
        {/* Progress Bar Section */}
        <section className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Your Progress: {currentProgress}%
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="bg-green-500 h-8 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-white font-bold text-sm"
              style={{ width: `${currentProgress}%` }}
            >
              {currentProgress > 0 && `${currentProgress}%`}
            </div>
          </div>
          {isLoggedIn && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleResetPlan}
                disabled={isProcessing}
                className={`flex items-center space-x-2 px-5 py-2 rounded-md font-semibold transition
                  ${
                    isProcessing
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }
                `}
              >
                <RefreshCcw className="h-5 w-5" />
                <span>Reset Plan</span>
              </button>
            </div>
          )}
        </section>
        {/* Checklist Section */}
        <section className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Trip Preparation Checklist
          </h2>
          <div className="space-y-6">
            {Object.keys(groupedChecklist).map((category) => (
              <div
                key={category}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">
                  {category}
                </h3>
                <div className="space-y-3">
                  {groupedChecklist[category].map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center p-3 rounded-md transition-all duration-200
                        ${
                          item.isCompleted
                            ? 'bg-green-50'
                            : 'bg-white hover:bg-gray-100'
                        }
                        ${
                          isLoggedIn
                            ? 'cursor-pointer'
                            : 'cursor-default opacity-70'
                        }
                      `}
                      onClick={() =>
                        isLoggedIn &&
                        handleChecklistItemToggle(item.id, item.isCompleted)
                      }
                    >
                      <div className="flex-shrink-0 mr-3">
                        {item.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle
                            className={`h-6 w-6 ${
                              isLoggedIn ? 'text-gray-400' : 'text-gray-300'
                            }`}
                          />
                        )}
                      </div>
                      <p
                        className={`text-gray-700 ${
                          item.isCompleted ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLoggedIn
              ? 'Your progress is saved automatically.'
              : 'Log in to start saving your progress!'}
          </p>
        </section>
        {/* Static Sections (Direct Flights & Upon Arrival) */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direct Flights Card */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center space-x-3">
                <Plane className="h-7 w-7 text-blue-600" />
                <span>Direct Flights to Kosovo</span>
              </h2>
              <p className="text-gray-700 mb-4">
                Several international airports offer direct flights to Pristina
                International Airport (PRN) in Kosovo. Major airlines operate
                routes from key European cities.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>
                  Flights commonly available from: Berlin, London, Vienna,
                  Zurich, Munich, Istanbul, Budapest, etc.
                </li>
                <li>
                  Airlines often include: Wizz Air, Eurowings, Austrian
                  Airlines, Turkish Airlines, Swiss International Air Lines.
                </li>
                <li>
                  It's recommended to check directly with airlines for the most
                  up-to-date schedules and availability.
                </li>
              </ul>
              <div className="text-center">
                <a
                  href="https://wizzair.com/en-gb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition font-medium"
                >
                  Find Flights on Wizz Air
                </a>
              </div>
            </div>

            {/* Upon Arrival Card */}
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center space-x-3">
                <Car className="h-7 w-7 text-green-600" />
                <span>Upon Arrival in Kosovo</span>
              </h2>
              <p className="text-gray-700 mb-4">
                Once you arrive at Pristina International Airport, getting to
                your accommodation or exploring the region is straightforward.
              </p>
              <div className="grid grid-cols-1 gap-6">
                {' '}
                {/* Using a nested grid for internal layout */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Taxis
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Official airport taxis are available right outside the
                    terminal. It's advisable to agree on a price before starting
                    your journey, or ensure the meter is used.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Taxi Era: +383 44 660 002</li>
                    <li>Blue Taxi: +383 49 800 900</li>
                    <li>Speed Taxi: +383 49 904 040</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Car Rentals
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Major international and local car rental agencies operate at
                    Pristina Airport. Booking in advance is recommended,
                    especially during peak season.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>
                      International Rental Companies:Hertz, Avis, Europcar,
                      Enterprise.
                    </li>
                    <li>
                      Local Rental Companies: Check local providers for
                      competitive rates.
                    </li>
                  </ul>
                  <div className="text-center mt-4">
                    <a
                      href="https://www.rentalcars.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition font-medium"
                    >
                      Book a Rental Car
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>{' '}
        {/* End of Static Sections Wrapper */}
      </div>
    </div>
  );
}
