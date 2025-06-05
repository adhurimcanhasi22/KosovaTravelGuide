'use client';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Using axios for fetching data
import BookmarkButton from '../../components/BookmarkButton';

import {
  CalendarDays,
  Wifi,
  Dumbbell, // For Fitness Center
  Sparkles, // For Spa or general features
  Utensils, // For Restaurant/Bar
  Flame, // For heating or specific features
  Droplet, // For Pool
  MapPin, // For location
  Building, // For hotel type (changed from Hotel to Building for broader use)
  Star, // For rating
  Car, // For Free Parking
  PartyPopper, // For Private Events
  Mountain, // For Mountain Views
  Leaf, // For Organic Food
  Tent, // For Camping Spots
  LandPlot, // For Garden
  Sun, // For Terrace
} from 'lucide-react'; // Using lucide-react for icons

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceSort, setPriceSort] = useState(''); // 'low-to-high', 'high-to-low'
  const [ratingFilter, setRatingFilter] = useState(''); // To store the selected rating

  // Fetch accommodations from the backend
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL is not defined.');
        }
        // Changed to fetch from the new public endpoint
        const response = await axios.get(`${apiUrl}/public/accommodations`);

        if (response.data.status === 'SUCCESS') {
          setAccommodations(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch accommodations'
          );
        }
      } catch (err) {
        console.error('Error fetching accommodations:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load accommodations.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Filter and sort accommodations based on user input
  const filteredAndSortedAccommodations = useMemo(() => {
    let filtered = accommodations;

    // 1. Search Term Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          acc.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          acc.type.toLowerCase().includes(lowerCaseSearchTerm) ||
          (acc.features &&
            acc.features.some((feature) =>
              feature.toLowerCase().includes(lowerCaseSearchTerm)
            ))
      );
    }

    // 2. City Filter
    if (selectedCity) {
      filtered = filtered.filter(
        (acc) => acc.location.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // 3. Rating Filter
    if (ratingFilter) {
      filtered = filtered.filter((acc) => acc.rating >= parseInt(ratingFilter));
    }

    // 4. Price Sort
    if (priceSort) {
      filtered = [...filtered].sort((a, b) => {
        if (priceSort === 'low-to-high') {
          return a.price - b.price;
        } else if (priceSort === 'high-to-low') {
          return b.price - a.price;
        }
        return 0; // No sort
      });
    }

    return filtered;
  }, [accommodations, searchTerm, selectedCity, ratingFilter, priceSort]);

  // Helper function to get the correct Lucide icon for amenities
  const getAmenityIcon = (amenity) => {
    const lowerCaseAmenity = amenity.toLowerCase();
    switch (lowerCaseAmenity) {
      case 'pool':
        return <Droplet className="h-4 w-4 text-gray-600" />;
      case 'spa':
        return <Sparkles className="h-4 w-4 text-gray-600" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4 text-gray-600" />;
      case 'fitness center':
        return <Dumbbell className="h-4 w-4 text-gray-600" />;
      case 'free wifi':
        return <Wifi className="h-4 w-4 text-gray-600" />;
      case 'bar':
        return <Utensils className="h-4 w-4 text-gray-600" />;
      case 'free parking':
        return <Car className="h-4 w-4 text-gray-600" />;
      case 'private events':
        return <PartyPopper className="h-4 w-4 text-gray-600" />;
      case 'mountain views':
        return <Mountain className="h-4 w-4 text-gray-600" />;
      case 'organic food':
        return <Leaf className="h-4 w-4 text-gray-600" />;
      case 'camping spots':
        return <Tent className="h-4 w-4 text-gray-600" />;
      case 'garden':
        return <LandPlot className="h-4 w-4 text-gray-600" />;
      case 'terrace':
        return <Sun className="h-4 w-4 text-gray-600" />;
      default:
        return null; // Or a generic icon if no specific match
    }
  };
  const handleBookmarkToggle = (newIsBookmarked) => {
    console.log('Bookmark status toggled in ToursPage:', newIsBookmarked);
  };

  // Extract unique cities for the dropdown
  const uniqueCities = useMemo(() => {
    const cities = new Set(accommodations.map((acc) => acc.location));
    return Array.from(cities).sort();
  }, [accommodations]);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2024/07/05/0509/TXNRH-R0006-Family-Suite-Bedroom.jpg/TXNRH-R0006-Family-Suite-Bedroom.16x9.jpg?imwidth=1920"
            alt="Accommodation Background"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src =
                'https://placehold.co/1200x350/cccccc/333333?text=Accommodation+Background';
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg px-4 py-2 rounded">
            Accommodation in Kosova
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md">
            Find the best places to stay across the country
          </h5>
        </div>
      </div>

      <section className="w-full bg-white py-6 px-4 flex justify-center shadow-lg my-1">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search accommodations..."
            className="w-full md:w-[300px] px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Dropdown 1 - Select City */}
          <select
            className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select City</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {/* Dropdown 2 - Filter by Price */}
          <select
            className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
          {/* Dropdown 3 - Filter by Rating */}
          <select
            className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">Filter by Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars & Above</option>
            <option value="3">3 Stars & Above</option>
            <option value="2">2 Stars & Above</option>
            <option value="1">1 Star & Above</option>
          </select>
        </div>
      </section>

      {/* Loading and Error Messages */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">Loading accommodations...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-lg text-red-600">Error: {error}</p>
          <p className="text-md text-gray-500">Please try again later.</p>
        </div>
      )}

      {/* Hotel Cards Section */}
      {!loading && !error && filteredAndSortedAccommodations.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">
            No accommodations found matching your criteria.
          </p>
        </div>
      )}

      {!loading && !error && filteredAndSortedAccommodations.length > 0 && (
        <section className="w-full bg-white py-10 px-4 shadow-md">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAccommodations.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative"
              >
                <div className="relative w-full h-[300px]">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/300x300/cccccc/333333?text=${hotel.name}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
                    From €{hotel.price}/night
                  </div>
                </div>
                <div className="p-5 flex flex-col text-left">
                  {/* Name and Rating */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-black">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-700 font-medium text-sm">
                        {hotel.rating}
                      </span>
                    </div>
                  </div>
                  {/* Location, Type, and Bookmark Button Row */}
                  <div className="flex items-start justify-between mt-4">
                    <div>
                      <div className="flex items-center text-gray-600 space-x-2">
                        <MapPin className="h-6 w-6 text-red-400" />
                        <span>{hotel.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building className="h-6 w-6 text-black" />
                        <span>{hotel.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BookmarkButton
                        itemId={hotel.id}
                        bookmarkType="accommodation"
                        onToggle={handleBookmarkToggle}
                      />
                    </div>
                  </div>
                  <hr className="my-4 border-gray-200" />
                  <div className="flex flex-wrap gap-2">
                    {hotel.features &&
                      hotel.features.map((item) => (
                        <span
                          key={item}
                          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                  {hotel.bookingUrl ? (
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-[1rem] cursor-pointer text-white py-2 px-4 rounded-md bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-colors duration-200 text-center"
                    >
                      View Details
                    </a>
                  ) : (
                    <button
                      className="w-full mt-[1rem] bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Details Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Accommodation Section (Rendered below main grid) */}
      {!loading && !error && filteredAndSortedAccommodations.length > 0 && (
        <section className="py-12 px-6 bg-gray-50 w-full">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
            {filteredAndSortedAccommodations.map((hotel) => (
              <div
                key={`detail-${hotel.id}`}
                className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full md:w-1/3 h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/300x300/cccccc/333333?text=${hotel.name}`;
                  }}
                />
                <div className="p-6 flex-1 relative">
                  <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
                    €{hotel.price}{' '}
                    <span className="text-sm text-gray-600">per night</span>
                  </div>

                  <h3 className="text-2xl font-semibold">{hotel.name}</h3>
                  <div className="flex items-center text-yellow-500 mb-1">
                    {'★'.repeat(Math.floor(hotel.rating))}
                    {'☆'.repeat(5 - Math.floor(hotel.rating))}{' '}
                    <span className="text-gray-600 ml-2">
                      {hotel.rating} out of 5
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2 space-x-2">
                    <MapPin className="h-6 w-6 text-red-700" />
                    <span>{hotel.location}, Kosovo</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 space-x-2">
                    <Building className="h-6 w-6 text-zinc-400" />
                    <span>{hotel.type}</span>
                  </div>

                  {/* Placeholder for description if you add it to your schema */}
                  <p className="text-gray-700 my-4">
                    Experience comfortable and convenient accommodations at{' '}
                    {hotel.name}. Located in {hotel.location}, this {hotel.type}{' '}
                    offers excellent amenities and is perfect for travelers
                    looking for great accommodations in Kosovo.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm mb-4">
                    {hotel.features &&
                      hotel.features.map((item) => (
                        <span
                          key={item}
                          className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1"
                        >
                          {getAmenityIcon(item)}
                          <span>{item}</span>
                        </span>
                      ))}
                  </div>

                  <div className="flex gap-4 mt-4">
                    {hotel.bookingUrl ? (
                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] text-white px-4 py-2 rounded flex items-center gap-2"
                      >
                        <CalendarDays className="h-5 w-5" />
                        Check Availability
                      </a>
                    ) : (
                      <button
                        className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed flex items-center gap-2"
                        disabled
                      >
                        <CalendarDays className="h-5 w-5" />
                        Check Availability (N/A)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
