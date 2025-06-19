'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Hotel,
  Car,
  Plane,
  CalendarDays,
  Euro,
  Search,
  XCircle,
  Utensils, // For restaurants
  Compass, // For destinations (general)
  Users, // For tours (group size)
  Clock, // For tours (duration)
  MessageSquareText, // For chatbot,
  Info,
} from 'lucide-react';

export default function Home() {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [featuredAccommodations, setFeaturedAccommodations] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]); // NEW: Restaurants state
  const [featuredTours, setFeaturedTours] = useState([]);
  const [featuredTravelTips, setFeaturedTravelTips] = useState([]); // NEW: Travel Tips state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel states
  const carouselImages = [
    'https://i.im.ge/2025/06/19/JuP2zz.kosowo-natura.jpeg', // REPLACE with your actual image URLs
    'https://i.im.ge/2025/06/19/Ju6BrK.kosovo-tours-2.png',
    'https://i.im.ge/2025/06/19/JutdCm.Gjeravica-2.jpeg',
    'https://i.im.ge/2025/06/19/JuyXJJ.landscape-3723345-1920.jpeg',
    'https://i.im.ge/2025/06/19/JuNVFC.Tropoja-Lake-Kosovo.png',
    // Add more if you have them, up to 5
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [carouselImages.length]);

  // Function to fetch all necessary home page data
  const fetchHomePageData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined.');
      }

      // Fetching up to 6 items for each category and 3 for travel tips
      // Note: Assuming backend doesn't have an `isFeatured` filter, so we take the first few.
      const [destRes, accommRes, toursRes, restaurantsRes, travelTipsRes] =
        await Promise.all([
          axios.get(`${apiUrl}/public/destinations`), // Fetch all and slice
          axios.get(`${apiUrl}/public/accommodations`),
          axios.get(`${apiUrl}/public/tours`),
          axios.get(`${apiUrl}/public/restaurants`), // NEW: Fetch restaurants
          axios.get(`${apiUrl}/public/traveltips`), // NEW: Fetch travel tips
        ]);

      if (
        destRes.data?.status === 'SUCCESS' &&
        Array.isArray(destRes.data.data) &&
        accommRes.data?.status === 'SUCCESS' &&
        Array.isArray(accommRes.data.data) &&
        toursRes.data?.status === 'SUCCESS' &&
        Array.isArray(toursRes.data.data) &&
        restaurantsRes.data?.status === 'SUCCESS' &&
        Array.isArray(restaurantsRes.data.data) && // Check restaurants
        travelTipsRes.data?.status === 'SUCCESS' &&
        Array.isArray(travelTipsRes.data.data) // Check travel tips
      ) {
        setFeaturedDestinations(destRes.data.data.slice(0, 6)); // Take first 6
        setFeaturedAccommodations(accommRes.data.data.slice(0, 6)); // Take first 6
        setFeaturedTours(toursRes.data.data.slice(0, 6)); // Take first 6
        setFeaturedRestaurants(restaurantsRes.data.data.slice(0, 6)); // Take first 6
        setFeaturedTravelTips(travelTipsRes.data.data.slice(0, 3)); // Take first 3 for tips
      } else {
        console.error('Invalid home page data structure:', {
          destRes: destRes.data,
          accommRes: accommRes.data,
          toursRes: toursRes.data,
          restaurantsRes: restaurantsRes.data,
          travelTipsRes: travelTipsRes.data,
        });
        setError('Failed to load home page data due to invalid format.');
      }
    } catch (err) {
      console.error('Error fetching home page data:', err);
      setError('Failed to load home page data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
        {carouselImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Kosovo landscape slide ${index + 1}`}
            fill
            priority={index === 0} // Load first image with high priority
            unoptimized={true}
            className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 absolute'
            }`}
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10 px-4 bg-black/25">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Your Ultimate Guide to Kosova
          </h1>
          <p className="text-lg md:text-xl mt-4 max-w-3xl drop-shadow-md">
            Discover Europe's Hidden Gem. Ancient Heritage, Breathtaking Nature,
            and Unforgettable Experiences Await.
          </p>
        </div>
      </section>

      {/* Loading and Error Messages */}
      {loading && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 animate-pulse">
            Loading amazing content...
          </p>
        </div>
      )}
      {error && (
        <div className="text-center py-20">
          <p className="text-xl text-red-600 font-semibold">Error: {error}</p>
          <p className="text-lg text-gray-500 mt-2">
            Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Featured Destinations Section */}
      {!loading && !error && (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Top Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-12">
              Explore Kosovo's most captivating places, from historic cities to
              breathtaking natural wonders.
            </p>
            {featuredDestinations.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No destinations found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredDestinations.map((destination) => (
                  <Link
                    key={destination._id}
                    href={`/destinations/${
                      destination.slug || destination._id
                    }`}
                    className="block"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={
                            destination.image ||
                            'https://placehold.co/600x400?text=Destination+Image'
                          }
                          alt={destination.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                          {destination.name}
                        </h3>
                        <p className="text-gray-700 text-sm flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-red-400" />
                          <span>{destination.region}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link
                href="/destinations"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200"
              >
                View All Destinations
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Accommodations Section */}
      {!loading && !error && (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Great Places to Stay
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From luxurious hotels to charming guesthouses, find your perfect
              home away from home.
            </p>
          </div>

          {featuredAccommodations.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No accommodations found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredAccommodations.map((accommodation) => (
                <Link
                  key={accommodation.id}
                  href={`/accommodations/`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={
                          accommodation.image ||
                          'https://placehold.co/600x400?text=Accommodation+Image'
                        }
                        alt={accommodation.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {accommodation.name}
                      </h3>
                      <p className="text-gray-700 text-sm flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-red-400" />
                        <span>{accommodation.location}</span>
                      </p>
                      <p className="text-gray-700 text-sm flex items-center space-x-1 mt-1">
                        <Hotel className="h-4 w-4 text-gray-600" />
                        <span>{accommodation.type}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/accommodations"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200"
            >
              View All Accommodations
            </Link>
          </div>
        </section>
      )}

      {/* Featured Restaurants Section (NEW) */}
      {!loading && !error && (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Top Restaurants
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Savor the flavors of Kosovo with our selection of top-rated
              restaurants and local eateries.
            </p>
          </div>

          {featuredRestaurants.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No restaurants found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={
                          restaurant.image ||
                          'https://placehold.co/600x400?text=Restaurant+Image'
                        }
                        alt={restaurant.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-700 text-sm flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-red-400" />
                        <span>{restaurant.location}</span>
                      </p>
                      <p className="text-gray-700 text-sm flex items-center space-x-1 mt-1">
                        <Utensils className="h-4 w-4 text-gray-600" />
                        <span>{restaurant.cuisine}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/restaurants"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200"
            >
              View All Restaurants
            </Link>
          </div>
        </section>
      )}

      {/* Featured Tours Section */}
      {!loading && !error && (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Exciting Guided Tours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover Kosovo's hidden gems and iconic landmarks with our
              expert-led tours.
            </p>
          </div>

          {featuredTours.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No tours found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredTours.map((tour) => (
                <Link key={tour.id} href={`/tours/`} className="block">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={
                          tour.image ||
                          'https://placehold.co/300x300/cccccc/333333?text=Tour+Image'
                        }
                        alt={tour.name}
                        className="object-cover w-full h-full rounded-t-lg"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/300x300/cccccc/333333?text=${tour.name}`;
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {tour.name}
                      </h3>
                      <p className="text-gray-700 text-sm flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-red-400" />
                        <span>{tour.location}</span>
                      </p>
                      <p className="text-gray-700 text-sm flex items-center space-x-1 mt-1">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span>{tour.duration}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200"
            >
              View All Tours
            </Link>
          </div>
        </section>
      )}

      {/* Travel Tips Section (Dynamic) */}
      {!loading && !error && (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Essential Travel Tips
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make the most of your trip to Kosovo with these essential travel
              guidelines.
            </p>
          </div>

          {featuredTravelTips.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No travel tips found.
            </p>
          ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 text-left">
              {featuredTravelTips.map(
                (
                  tip // Use fetched tips
                ) => (
                  <div
                    key={tip._id}
                    className="bg-blue-50 shadow-md rounded-xl p-8 flex flex-col items-start hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4 text-blue-700">
                      <span className="mr-3 p-2 bg-blue-100 rounded-full">
                        {/* You'll need to decide on specific icons for travel tips based on their categories/titles */}
                        <Info className="h-6 w-6" /> {/* Generic for now */}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {tip.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line flex-grow">
                      {tip.content.substring(0, 150)}... {/* Show snippet */}
                    </p>
                    <Link
                      href={`/travel-tips/`} // Link to dynamic travel tip page
                      className="mt-4 text-blue-600 hover:underline text-sm font-semibold"
                    >
                      Read More
                    </Link>
                  </div>
                )
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/travel-tips"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-md transition-colors duration-200"
            >
              View All Travel Tips
            </Link>
          </div>
        </section>
      )}

      {/* Travel Planner Call to Action Section */}
      <section className="bg-gradient-to-r from-[var(--enterprise-skyblue)] to-[var(--enterprise-lightblue)] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Plan Your Perfect Kosovo Adventure
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Our intuitive Travel Planner helps you organize every detail of your
            trip, ensuring a seamless and memorable experience.
          </p>
          <Link
            href="/travel-planner"
            className="inline-block bg-white text-purple-800 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-xl text-lg transform hover:scale-105"
          >
            Start Planning Now!
          </Link>
        </div>
      </section>

      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-3 text-gray-800">
            Need Instant Answers?
          </h3>
          <p className="text-lg text-gray-700">
            Our AI-powered travel assistant is here to help with quick
            questions. Look for the chat icon on the{' '}
            <strong className="font-semibold">bottom right corner</strong> of
            your screen!
          </p>
        </div>
      </section>
    </div>
  );
}