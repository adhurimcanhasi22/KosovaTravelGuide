'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  RefreshCcw,
  Plane,
  Car,
  DollarSign,
  Banknote,
  Clock,
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function TravelPlannerPage() {
  const router = useRouter();
  const [travelPlan, setTravelPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [exchangeRates, setExchangeRates] = useState(null);
  const [exchangeRatesLoading, setExchangeRatesLoading] = useState(true);
  const [exchangeRatesError, setExchangeRatesError] = useState(null);

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

  const fetchPlannerData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setExchangeRatesLoading(true);
    setExchangeRatesError(null);

    const token = localStorage.getItem('token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setError('NEXT_PUBLIC_API_URL is not defined.');
      setIsLoading(false);
      setExchangeRatesLoading(false);
      return;
    }

    try {
      const ratesResponse = await axios.get(`${apiUrl}/public/exchange-rates`);
      if (ratesResponse.data.status === 'SUCCESS') {
        setExchangeRates(ratesResponse.data.data);
      } else {
        throw new Error(
          ratesResponse.data.message || 'Failed to fetch exchange rates'
        );
      }
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setExchangeRatesError('Failed to load exchange rates.');
    } finally {
      setExchangeRatesLoading(false);
    }

    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        } else {
          const response = await axios.get(`${apiUrl}/user/travelplan`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.status === 'SUCCESS') {
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
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setTravelPlan({
        name: 'Guest Travel Plan',
        progressPercentage: 0,
        checklist: checklistItems.map((item) => ({
          ...item,
          isCompleted: false,
        })),
      });
    }
  }, [router]);

  useEffect(() => {
    fetchPlannerData();
  }, [fetchPlannerData]);

  const handleChecklistItemToggle = useCallback(
    async (itemId, currentStatus) => {
      if (!isLoggedIn) {
        alert('Please log in to save your travel plan progress.');
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
          { isCompleted: !currentStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'SUCCESS') {
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

  const handleResetPlan = useCallback(async () => {
    if (!isLoggedIn) {
      alert('Please log in to manage your travel plan.');
      return;
    }
    if (
      !window.confirm(
        'Are you sure you want to reset your travel plan? This cannot be undone.'
      )
    ) {
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
        await fetchPlannerData();
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
  }, [isLoggedIn, fetchPlannerData, router]);

  const groupedChecklist =
    travelPlan?.checklist?.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {}) || {};

  const currentProgress = travelPlan ? travelPlan.progressPercentage : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {!isLoading && !error && travelPlan ? (
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
          {/* New Horizontal Sections for Flights, Arrival, Currency */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
              {' '}
              {/* Removed grid, added space-y */}
              {/* Direct Flights Card */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center space-x-3">
                  <Plane className="h-7 w-7 text-blue-600" />
                  <span>Direct Flights to Kosovo</span>
                </h2>
                <p className="text-gray-700 mb-4">
                  Several international airports offer direct flights to
                  Pristina International Airport (PRN) in Kosovo. Major airlines
                  operate routes from key European cities.
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
                    It's recommended to check directly with airlines for the
                    most up-to-date schedules and availability.
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
              {/* Upon Arrival Card (including Taxis & Car Rentals) */}
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
                  {/* Inner grid for Taxis/Rentals */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Taxis
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Official airport taxis are available right outside the
                      terminal. It's advisable to agree on a price before
                      starting your journey, or ensure the meter is used.
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
                      Major international and local car rental agencies operate
                      at Pristina Airport. Booking in advance is recommended,
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
              {/* Currency Exchange Rates Card */}
              <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center space-x-3">
                  <Banknote className="h-7 w-7 text-purple-600" />
                  <span>Currency Exchange Rates</span>
                </h2>
                {exchangeRatesLoading ? (
                  <p className="text-gray-700">Loading rates...</p>
                ) : exchangeRatesError ? (
                  <p className="text-red-600">Error: {exchangeRatesError}</p>
                ) : exchangeRates ? (
                  <>
                    <p className="text-gray-700 mb-3">
                      Base currency in Kosovo:{' '}
                      <span className="font-semibold">
                        {exchangeRates.baseCurrency}
                      </span>
                    </p>
                    <div className="space-y-2">
                      {Object.entries(exchangeRates.rates).map(
                        ([currencyCode, rate]) => (
                          <div
                            key={currencyCode}
                            className="flex items-center justify-between text-gray-700"
                          >
                            <span className="font-medium">
                              {exchangeRates.baseCurrency} 1
                            </span>
                            <DollarSign className="h-4 w-4 text-gray-600 mx-1" />
                            <span className="font-medium"> = </span>
                            <span className="font-bold ml-1">
                              {rate.toFixed(3)}
                            </span>
                            <span className="font-medium ml-1">
                              {currencyCode}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-4 flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last updated:{' '}
                        {new Date(
                          exchangeRates.lastUpdated
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-700">
                    No exchange rate data available.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          {isLoading && (
            <div className="text-xl">Loading your travel plan...</div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center text-red-600">
              <p>Error loading travel plan:</p>
              <p>{error}</p>
              <button
                onClick={() =>
                  isLoggedIn ? fetchPlannerData() : router.push('/auth/login')
                }
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isLoggedIn ? 'Try Again' : 'Go to Login'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
