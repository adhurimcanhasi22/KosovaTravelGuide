'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Using axios for fetching data
import BookmarkButton from '../../components/BookmarkButton';

import {
  CalendarDays, // For tour date
  MapPin, // For tour location
  Users, // For group size
  Clock, // For tour duration
  DollarSign, // For price, though not used as an amenity icon
  Info, // Generic icon for features if no specific one
  Star, // For rating (if you add a rating to tours later)
  CheckCircle, // For highlights and included items
} from 'lucide-react'; // Using lucide-react for icons

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceSort, setPriceSort] = useState(''); // 'low-to-high', 'high-to-low'
  const [durationFilter, setDurationFilter] = useState(''); // '1 day', '2-3 days', '4+ days'
  const [groupSizeFilter, setGroupSizeFilter] = useState(''); // 'Small Group', 'Private'

  // Fetch tours from the backend
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL is not defined.');
        }
        const response = await axios.get(`${apiUrl}/public/tours`); // Fetch from public tours endpoint

        if (response.data.status === 'SUCCESS') {
          setTours(response.data.data || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch tours');
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to load tours.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Filter and sort tours based on user input
  const filteredAndSortedTours = useMemo(() => {
    let filtered = tours;

    // 1. Search Term Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tour) =>
          // FIX: Explicitly convert to String to handle non-string values safely
          String(tour.name || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          String(tour.description || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          String(tour.location || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          String(tour.duration || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          String(tour.groupSize || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          (Array.isArray(tour.highlights) &&
            tour.highlights.some((highlight) =>
              String(highlight || '')
                .toLowerCase()
                .includes(lowerCaseSearchTerm)
            ))
      );
    }

    // 2. Location Filter
    if (selectedLocation) {
      filtered = filtered.filter(
        (tour) =>
          String(tour.location || '').toLowerCase() ===
          selectedLocation.toLowerCase()
      );
    }

    // 3. Duration Filter
    if (durationFilter) {
      filtered = filtered.filter((tour) => {
        // FIX: Explicitly convert to String to handle non-string values safely
        const tourDurationDays = parseInt(
          String(tour.duration || '0').split(' ')[0]
        ); // "1 day" -> 1, "3 days" -> 3
        if (durationFilter === '1 day') {
          return tourDurationDays === 1;
        } else if (durationFilter === '2-3 days') {
          return tourDurationDays >= 2 && tourDurationDays <= 3;
        } else if (durationFilter === '4+ days') {
          return tourDurationDays >= 4;
        }
        return true; // Should not happen if dropdown values are controlled
      });
    }

    // 4. Group Size Filter
    if (groupSizeFilter) {
      filtered = filtered.filter(
        (tour) =>
          String(tour.groupSize || '').toLowerCase() ===
          groupSizeFilter.toLowerCase()
      );
    }

    // 5. Price Sort
    if (priceSort) {
      filtered = [...filtered].sort((a, b) => {
        // Ensure price is a number for sorting
        const priceA = parseFloat(String(a.price) || '0') || 0; // FIX: Explicitly convert to String
        const priceB = parseFloat(String(b.price) || '0') || 0; // FIX: Explicitly convert to String

        if (priceSort === 'low-to-high') {
          return priceA - priceB;
        } else if (priceSort === 'high-to-low') {
          return priceB - priceA;
        }
        return 0; // No sort
      });
    }

    return filtered;
  }, [
    tours,
    searchTerm,
    selectedLocation,
    durationFilter,
    groupSizeFilter,
    priceSort,
  ]);

  // Helper function to get the correct Lucide icon for tour features
  const getTourFeatureIcon = (featureName) => {
    const lowerCaseFeature = featureName.toLowerCase();
    switch (lowerCaseFeature) {
      case 'duration':
        return <Clock className="h-4 w-4 text-gray-600" />;
      case 'group size':
        return <Users className="h-4 w-4 text-gray-600" />;
      case 'location':
        return <MapPin className="h-4 w-4 text-gray-600" />;
      case 'date':
        return <CalendarDays className="h-4 w-4 text-gray-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />; // Generic icon
    }
  };
  const handleBookmarkToggle = (newIsBookmarked) => {
    console.log('Bookmark status toggled in ToursPage:', newIsBookmarked);
  };

  // Extract unique locations for the dropdown
  const uniqueLocations = useMemo(() => {
    // FIX: Filter out null/undefined locations and ensure they are strings
    const locations = new Set(
      tours.map((tour) => String(tour.location)).filter(Boolean)
    );
    return Array.from(locations).sort();
  }, [tours]);

  // Extract unique group sizes for the dropdown
  const uniqueGroupSizes = useMemo(() => {
    // FIX: Filter out null/undefined group sizes and ensure they are strings
    const groupSizes = new Set(
      tours.map((tour) => String(tour.groupSize)).filter(Boolean)
    );
    return Array.from(groupSizes).sort();
  }, [tours]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1350&q=80"
          alt="Accommodation Background"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/1200x350/cccccc/333333?text=Accommodation+Background';
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg">
            Guided Tours in Kosovo
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md">
            Experience the best of Kosovo with our carefully crafted tours
          </h5>
        </div>
      </div>

      {/* Filters and Search Section */}
      <section className="w-full bg-white py-6 px-4 flex justify-center shadow-lg my-1">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search tours..."
            className="w-full md:w-[250px] px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Dropdown 1 - Select Location */}
          <select
            className="w-full md:w-[180px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          {/* Dropdown 2 - Filter by Duration */}
          <select
            className="w-full md:w-[180px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <option value="">All Durations</option>
            <option value="1 day">Day Trips (1 day)</option>
            <option value="2-3 days">Short Tours (2-3 days)</option>
            <option value="4+ days">Extended Tours (4+ days)</option>
          </select>
          {/* Dropdown 3 - Filter by Group Size */}
          <select
            className="w-full md:w-[180px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={groupSizeFilter}
            onChange={(e) => setGroupSizeFilter(e.target.value)}
          >
            <option value="">All Group Sizes</option>
            {uniqueGroupSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {/* Dropdown 4 - Sort by Price */}
          <select
            className="w-full md:w-[180px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>
      </section>

      {/* Loading and Error Messages */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">Loading tours...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-lg text-red-600">Error: {error}</p>
          <p className="text-md text-gray-500">Please try again later.</p>
        </div>
      )}

      {/* Tour Cards Section */}
      {!loading && !error && filteredAndSortedTours.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">
            No tours found matching your criteria.
          </p>
        </div>
      )}

      {!loading && !error && filteredAndSortedTours.length > 0 && (
        <section className="w-full bg-white py-10 px-4 shadow-md">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTours.map((tour) => (
              <div
                key={tour._id}
                className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative"
              >
                <div className="relative w-full h-[300px]">
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
                  <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
                    From €{tour.price}/person
                  </div>
                </div>
                <div className="p-5 flex flex-col text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-black">
                      {tour.name}
                    </h3>
                    <BookmarkButton
                      itemId={tour.id}
                      bookmarkType="tour"
                      onToggle={handleBookmarkToggle}
                    />
                  </div>
                  <div className="flex items-center text-gray-600 mt-2 space-x-2">
                    <MapPin className="h-6 w-6 text-red-400" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2 space-x-2">
                    <Clock className="h-6 w-6 text-black" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2 space-x-2">
                    <Users className="h-6 w-6 text-black" />
                    <span>{tour.groupSize}</span>
                  </div>

                  <hr className="my-4 border-gray-200" />
                  <div className="flex flex-wrap gap-2">
                    {/* Assuming features are not explicitly in Tour model, using general info */}
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      Guided Tour
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {tour.duration}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {tour.groupSize}
                    </span>
                  </div>
                  {/* Link to detailed section or specific tour page */}
                  <Link
                    href={`#detail-${tour.id}`}
                    className="w-full mt-[1rem] cursor-pointer text-white py-2 px-4 rounded-md bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-colors duration-200 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Tour Section (Rendered below main grid) */}
      {!loading && !error && filteredAndSortedTours.length > 0 && (
        <section className="py-12 px-6 bg-gray-50 w-full">
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
            {filteredAndSortedTours.map((tour) => (
              <div
                key={`detail-${tour.id}`}
                id={`detail-${tour.id}`}
                className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden"
              >
                {/* Image Container (with price overlay) */}
                <div className="relative w-full md:w-1/3">
                  <img
                    src={
                      tour.image ||
                      'https://placehold.co/300x300/cccccc/333333?text=Tour+Image'
                    }
                    alt={tour.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/300x300/cccccc/333333?text=${tour.name}`;
                    }}
                  />
                  {/* Price positioned on top-right of the image */}
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-md shadow-sm">
                    <span className="text-lg font-bold text-blue-600">
                      €{tour.price}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      per person
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 flex-1">
                  <h3 className="text-2xl font-semibold">{tour.name}</h3>
                  {/* Uncomment if you add ratings to tours */}
                  {/* <div className="flex items-center text-yellow-500 mb-1">
              {'★'.repeat(Math.floor(tour.rating))}
              {'☆'.repeat(5 - Math.floor(tour.rating))}{' '}
              <span className="text-gray-600 ml-2">
                {tour.rating} out of 5
              </span>
            </div> */}
                  <div className="flex items-center text-gray-600 mt-2 space-x-2">
                    <MapPin className="h-6 w-6 text-red-700" />
                    <span>{tour.location}, Kosovo</span>
                  </div>
                  <div className="flex items-wrap gap-2 text-sm text-gray-600 mt-2">
                    <span className="flex items-center space-x-2">
                      {getTourFeatureIcon('duration')}
                      <span>{tour.duration}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      {getTourFeatureIcon('group size')}
                      <span>{tour.groupSize}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      {getTourFeatureIcon('date')}
                      <span>{new Date(tour.date).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <p className="text-gray-700 my-4">{tour.description}</p>

                  <div className="mb-6">
                    <h3 className="font-bold mb-2 text-gray-800">
                      Tour Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tour.highlights &&
                        tour.highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="flex items-start text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-2 text-gray-800">
                      What's Included
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-start text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Professional English-speaking guide</span>
                      </div>
                      <div className="flex items-start text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Transportation in air-conditioned vehicle</span>
                      </div>
                      <div className="flex items-start text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Entrance fees to attractions</span>
                      </div>
                      <div className="flex items-start text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Bottled water</span>
                      </div>
                      {parseInt(tour.duration.split(' ')[0]) === 1 && (
                        <div className="flex items-start text-gray-700">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                          <span>Traditional lunch</span>
                        </div>
                      )}
                      {parseInt(tour.duration.split(' ')[0]) > 1 && (
                        <>
                          <div className="flex items-start text-gray-700">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <span>
                              Accommodation (
                              {parseInt(tour.duration.split(' ')[0]) - 1}{' '}
                              nights)
                            </span>
                          </div>
                          <div className="flex items-start text-gray-700">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Breakfast daily</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Booking Button (if needed) */}
                  <div className="flex gap-4 mt-4">
                    {/* Add booking button/link here if desired */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Tour Section */}
      <section className="section bg-white text-[var(--enterprise-blue)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Looking for Something Special?
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              We can create custom tours tailored to your interests, schedule,
              and group size
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl max-w-3xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Custom Tour Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mr-2 mt-1 flex-shrink-0" />
                    <span>Family tours with kid-friendly activities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mr-2 mt-1 flex-shrink-0" />
                    <span>Adventure and outdoor-focused experiences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mr-2 mt-1 flex-shrink-0" />
                    <span>Cultural and historical deep dives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mr-2 mt-1 flex-shrink-0" />
                    <span>Food and culinary explorations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-yellow-300 mr-2 mt-1 flex-shrink-0" />
                    <span>Photography tours with expert tips</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">
                  Contact For Custom Tours
                </h3>
                <p className="mb-4">
                  Reach out to our team to discuss your custom tour
                  requirements. We'll work with you to create the perfect Kosovo
                  experience.
                </p>
                <Link
                  href="/booking"
                  className="w-full flex items-center justify-center text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] py-2 px-4 rounded-md font-medium transition-colors duration-200 shadow"
                >
                  <Info className="mr-2 h-5 w-5" /> Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
