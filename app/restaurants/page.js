'use client';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Using axios for fetching data
import BookmarkButton from '../../components/BookmarkButton';

import {
  Utensils, // For general restaurant/eating
  ChefHat, // For cuisine or restaurant type
  Coffee, // For cafes
  MapPin, // For location
  Star, // For rating
  Euro, // For price range
  ExternalLink, // For TripAdvisor link
} from 'lucide-react'; // Using lucide-react for icons

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceSort, setPriceSort] = useState(''); // 'low-to-high', 'high-to-low' (for priceRange parsing)
  const [ratingFilter, setRatingFilter] = useState(''); // To store the selected rating
  const [cuisineFilter, setCuisineFilter] = useState(''); // New: filter by cuisine
  const [typeFilter, setTypeFilter] = useState(''); // New: filter by restaurant type

  // Fetch restaurants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL is not defined.');
        }
        // Changed to fetch from the new public endpoint for restaurants
        const response = await axios.get(`${apiUrl}/public/restaurants`);

        if (response.data.status === 'SUCCESS') {
          setRestaurants(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch restaurants'
          );
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load restaurants.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter and sort restaurants based on user input
  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = restaurants;

    // 1. Search Term Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (res) =>
          res.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          res.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          res.type.toLowerCase().includes(lowerCaseSearchTerm) ||
          (res.cuisine &&
            res.cuisine.toLowerCase().includes(lowerCaseSearchTerm)) ||
          res.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 2. City Filter
    if (selectedCity) {
      filtered = filtered.filter(
        (res) => res.location.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // 3. Rating Filter
    if (ratingFilter) {
      filtered = filtered.filter((res) => res.rating >= parseInt(ratingFilter));
    }

    // 4. Cuisine Filter (New)
    if (cuisineFilter) {
      filtered = filtered.filter(
        (res) =>
          res.cuisine &&
          res.cuisine.toLowerCase() === cuisineFilter.toLowerCase()
      );
    }

    // 5. Type Filter (New)
    if (typeFilter) {
      filtered = filtered.filter(
        (res) => res.type && res.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // 6. Price Sort (will sort by number of Euro signs as proxy)
    if (priceSort) {
      filtered = [...filtered].sort((a, b) => {
        const getPriceLevel = (priceStr) => {
          if (!priceStr) return 0;
          return priceStr.length; // Count Euro signs
        };
        if (priceSort === 'low-to-high') {
          return getPriceLevel(a.priceRange) - getPriceLevel(b.priceRange);
        } else if (priceSort === 'high-to-low') {
          return getPriceLevel(b.priceRange) - getPriceLevel(a.priceRange);
        }
        return 0; // No sort
      });
    }

    return filtered;
  }, [
    restaurants,
    searchTerm,
    selectedCity,
    ratingFilter,
    cuisineFilter,
    typeFilter,
    priceSort,
  ]);

  const handleBookmarkToggle = (newIsBookmarked) => {
    console.log('Bookmark status toggled in RestaurantsPage:', newIsBookmarked);
    // You might want to refresh the restaurants list or update the specific restaurant's bookmark status here
  };

  // Extract unique cities, cuisines, and types for the dropdowns
  const uniqueCities = useMemo(() => {
    const cities = new Set(restaurants.map((res) => res.location));
    return Array.from(cities).sort();
  }, [restaurants]);

  const uniqueCuisines = useMemo(() => {
    const cuisines = new Set(
      restaurants.map((res) => res.cuisine).filter(Boolean)
    ); // Filter out null/undefined
    return Array.from(cuisines).sort();
  }, [restaurants]);

  const uniqueTypes = useMemo(() => {
    const types = new Set(restaurants.map((res) => res.type).filter(Boolean)); // Filter out null/undefined
    return Array.from(types).sort();
  }, [restaurants]);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://cdn.choosechicago.com/uploads/2024/08/BEEF-LIBERTY-PDR-2-1800x1200.jpg"
            alt="Restaurants Background"
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src =
                'https://placehold.co/1920x500/cccccc/333333?text=Restaurants+Background';
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg px-4 py-2 rounded">
            Restaurants & Local Flavors in Kosova
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md">
            Discover the best dining experiences and hidden gems
          </h5>
        </div>
      </div>
      <section className="w-full bg-white py-6 px-4 flex justify-center shadow-lg my-1">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full md:w-[250px] px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Dropdown 1 - Select City */}
          <select
            className="w-full md:w-[150px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {/* Dropdown 2 - Filter by Cuisine (New) */}
          <select
            className="w-full md:w-[150px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {uniqueCuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
          {/* Dropdown 3 - Filter by Type (New) */}
          <select
            className="w-full md:w-[150px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {/* Dropdown 4 - Sort by Price */}
          <select
            className="w-full md:w-[150px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
            style={{ maxWidth: '100%' }}
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
          {/* Dropdown 5 - Filter by Rating */}
          <select
            className="w-full md:w-[150px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
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
          <p className="text-lg text-gray-700">Loading restaurants...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-10">
          <p className="text-lg text-red-600">Error: {error}</p>
          <p className="text-md text-gray-500">Please try again later.</p>
        </div>
      )}
      {/* Restaurant Cards Section */}
      {!loading && !error && filteredAndSortedRestaurants.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-700">
            No restaurants found matching your criteria.
          </p>
        </div>
      )}
      {!loading && !error && filteredAndSortedRestaurants.length > 0 && (
        <section className="w-full bg-white py-10 px-4 shadow-md">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative"
              >
                <div className="relative w-full h-[300px]">
                  <Image
                    src={
                      restaurant.image ||
                      'https://placehold.co/400x300/cccccc/333333?text=Restaurant'
                    }
                    alt={restaurant.name}
                    fill
                    className="object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/400x300/cccccc/333333?text=${restaurant.name}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                    <span>{restaurant.priceRange || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col text-left flex-grow">
                  {/* Name and Rating */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-black">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-700 font-medium text-sm">
                        {restaurant.rating || 'N/A'}
                      </span>
                    </div>
                  </div>
                  {/* Location */}
                  <div className="flex items-center text-gray-600 space-x-2 mt-2">
                    <MapPin className="h-6 w-6 text-red-400" />
                    <span>{restaurant.location}</span>
                  </div>
                  {/* Type, Cuisine, and BookmarkButton in one row */}
                  <div className="flex items-start justify-between mt-1">
                    <div>
                      <div className="flex items-center space-x-2">
                        <ChefHat className="h-6 w-6 text-black" />
                        <span>{restaurant.type}</span>
                      </div>
                      {restaurant.cuisine && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Utensils className="h-6 w-6 text-gray-700" />
                          <span>{restaurant.cuisine}</span>
                        </div>
                      )}
                    </div>
                    <BookmarkButton
                      itemId={restaurant.id}
                      bookmarkType="restaurant"
                      onToggle={handleBookmarkToggle}
                    />
                  </div>
                  {/* Description */}
                  <p className="text-gray-700 text-sm mt-3 mb-4 line-clamp-3">
                    {restaurant.description || 'No description available.'}
                  </p>
                  <hr className="my-4 border-gray-200" />
                  <div className="flex items-center justify-between mt-auto">
                    {' '}
                    {/* mt-auto pushes to bottom */}
                    {restaurant.tripadvisorUrl ? (
                      <Link
                        href={restaurant.tripadvisorUrl}
                        className="w-full mt-[1rem] cursor-pointer text-white py-2 px-4 rounded-md bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-colors duration-200 text-center"
                      >
                        View Details
                      </Link>
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
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}