'use client';
import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback } from 'react'; // Added useCallback
import Link from 'next/link';
import axios from 'axios';
import BookmarkButton from '../../components/BookmarkButton';
import dynamic from 'next/dynamic';
import ReviewButton from '../../components/ReviewButton';

import {
  MapPin, // For destination location/region
  Globe, // For general destination icon
  Compass, // For exploring
  Star, // For rating (if you add a rating to destinations later)
} from 'lucide-react';

// Dynamically import MyMap with SSR disabled
const DynamicMyMap = dynamic(() => import('../../components/MyMap'), {
  ssr: false, // This is crucial: do not render this component on the server
  loading: () => (
    <p className="text-center py-4 text-gray-600">Loading map...</p>
  ), // Optional: A loading state for the map
});

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [accommodations, setAccommodations] = useState([]); // State for accommodations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [nameSort, setNameSort] = useState('');

  // Fetch all necessary data (destinations and accommodations) from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL is not defined.');
        }

        const [destinationsResponse, accommodationsResponse] =
          await Promise.all([
            axios.get(`${apiUrl}/public/destinations`),
            axios.get(`${apiUrl}/public/accommodations`), // Fetch public accommodations
          ]);

        if (destinationsResponse.data.status === 'SUCCESS') {
          setDestinations(destinationsResponse.data.data || []);
        } else {
          throw new Error(
            destinationsResponse.data.message || 'Failed to fetch destinations'
          );
        }

        if (accommodationsResponse.data.status === 'SUCCESS') {
          setAccommodations(accommodationsResponse.data.data || []); // Set accommodations state
        } else {
          // If accommodations fail, log warning but don't stop destination rendering
          console.warn(
            'Failed to fetch accommodations for map:',
            accommodationsResponse.data.message
          );
          setAccommodations([]);
        }
      } catch (err) {
        console.error('Error fetching data for destinations page:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load page data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort destinations based on user input
  const filteredAndSortedDestinations = useMemo(() => {
    let filtered = destinations;

    // 1. Search Term Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dest) =>
          String(dest.name || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          String(dest.region || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          String(dest.description || '')
            .toLowerCase()
            .includes(lowerCaseSearchTerm)
      );
    }

    // 2. Region Filter
    if (selectedRegion) {
      filtered = filtered.filter(
        (dest) =>
          String(dest.region || '').toLowerCase() ===
          selectedRegion.toLowerCase()
      );
    }

    // 3. Name Sort
    if (nameSort) {
      filtered = [...filtered].sort((a, b) => {
        const nameA = String(a.name || '').toLowerCase();
        const nameB = String(b.name || '').toLowerCase();
        if (nameSort === 'asc') {
          return nameA.localeCompare(nameB);
        } else if (nameSort === 'desc') {
          return nameB.localeCompare(nameA);
        }
        return 0;
      });
    }

    return filtered;
  }, [destinations, searchTerm, selectedRegion, nameSort]);

  const handleBookmarkToggle = useCallback((newIsBookmarked) => {
    console.log(
      'Bookmark status toggled in DestinationsPage:',
      newIsBookmarked
    );
    // You might want to refresh the destinations list or update the specific destination's bookmark status here
    // For now, simply logging.
  }, []);

  // Extract unique regions for the dropdown
  const uniqueRegions = useMemo(() => {
    const regions = new Set(
      destinations.map((dest) => String(dest.region)).filter(Boolean)
    );
    return Array.from(regions).sort();
  }, [destinations]);

  // Determine initial map position (e.g., center of Kosovo or first destination)
  const initialMapPosition = useMemo(() => {
    if (
      destinations.length > 0 &&
      destinations[0].coordinates &&
      destinations[0].coordinates.length === 2
    ) {
      return destinations[0].coordinates;
    }
    // Default to a central point in Kosovo
    return [42.6629, 21.1655]; // Coordinates for Prishtina
  }, [destinations]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <img
          src="https://funkytours.com/wp-content/uploads/2022/12/Gjeravica.jpg"
          alt="Kosovo Destinations Background"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/1920x500/cccccc/333333?text=Destinations+Background';
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg px-4 py-2 rounded">
            Explore Destinations in Kosovo
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md">
            Uncover the beauty and history of every region
          </h5>
        </div>
      </div>
      {/* Filters and Search Section */}
      <section className="w-full bg-white py-6 px-4 flex justify-center shadow-lg my-1">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full md:w-[300px] px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Dropdown 1 - Select Region */}
          <select
            className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {/* Dropdown 2 - Sort by Name */}
          <select
            className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={nameSort}
            onChange={(e) => setNameSort(e.target.value)}
          >
            <option value="">Sort by Name</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </section>
      {/* Loading and Error Messages */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">Loading destinations...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-10">
          <p className="text-lg text-red-600">Error: {error}</p>
          <p className="text-md text-gray-500">Please try again later.</p>
        </div>
      )}
      {/* Destination Cards Section */}
      {!loading && !error && filteredAndSortedDestinations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">
            No destinations found matching your criteria.
          </p>
        </div>
      ) : (
        !loading &&
        !error && (
          <section className="w-full bg-white py-10 px-4 shadow-md">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedDestinations.map((destination) => (
                <div
                  key={destination.slug}
                  className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative"
                >
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={
                        destination.image ||
                        'https://placehold.co/300x300/cccccc/333333?text=Destination'
                      }
                      alt={destination.name}
                      fill
                      className="object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/300x300/cccccc/333333?text=${destination.name}`;
                      }}
                    />
                  </div>
                  <div className="p-5 flex flex-col text-left flex-grow">
                    <div className="flex flex-row justify-between items-start mb-2">
                      {/* Left side: vertically stacked infos */}
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold text-black">
                          {destination.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-5 w-5 text-red-400" />
                          <span>{destination.region}</span>
                        </div>
                      </div>
                      {/* Right side: vertically stacked buttons */}
                      <div className="flex flex-col items-end space-y-2">
                        <BookmarkButton
                          itemId={destination._id}
                          bookmarkType="city"
                          onToggle={handleBookmarkToggle}
                        />
                        <ReviewButton itemId={destination.slug} itemType="city" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-700 text-sm mt-3 mb-4 line-clamp-3">
                        {destination.description || 'No description available.'}
                      </p>
                    </div>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="w-full mt-auto cursor-pointer text-white py-2 px-4 rounded-md bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-colors duration-200 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      )}
      {/* Why Visit Kosovo Section */}
      <section className="bg-white py-10 px-4">
        <h3 className="text-2xl font-bold text-center mb-1">
          Why Visit Kosovo?
        </h3>
        <h5 className="text-center text-gray-600 mb-6 text-sm">
          Discover what makes Kosovo a unique destination worth exploring
        </h5>
        <section className="bg-white shadow-md rounded-md mt-10 px-4 py-12 max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-start text-center">
          {[
            {
              icon: '🏛️',
              title: 'Rich History',
              desc: 'Explore ancient Illyrian ruins, medieval monasteries, Ottoman mosques, and sites of recent historical significance.',
            },
            {
              icon: '⛰️',
              title: 'Natural Beauty',
              desc: 'Discover stunning landscapes including the Albanian Alps, dramatic canyons, waterfalls, and pristine lakes.',
            },
            {
              icon: '👥',
              title: 'Warm Hospitality',
              desc: 'Experience the legendary Kosovar hospitality and connect with locals known for their friendliness and generosity.',
            },
            {
              icon: '💰',
              title: 'Affordable Travel',
              desc: 'Enjoy quality accommodations, delicious food, and amazing experiences at prices much lower than Western Europe.',
            },
          ].map((item, index) => (
            <div key={index} className="flex-1 px-4 mb-6 md:mb-0">
              <div className="text-blue-700 text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-base mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </div>
          ))}
        </section>
      </section>
      {/* Map Section */}
      {!loading && !error && (
        <section className="w-full bg-white py-10 px-4 shadow-md">
          <div className="max-w-7xl mx-auto h-[600px] rounded-lg overflow-hidden shadow-xl">
            {/* Render DynamicMyMap here */}
            <DynamicMyMap
              position={initialMapPosition}
              zoom={9}
              cities={destinations.filter(
                (d) => d.coordinates && d.coordinates.length === 2
              )}
              hotels={accommodations}
            />
          </div>
        </section>
      )}
    </div>
  );
}
