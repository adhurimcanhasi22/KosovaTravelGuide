'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image'; // Assuming you'll display images
import { usePathname } from 'next/navigation'; // For App Router to get the slug

import { MapPin, Globe, Compass, Star } from 'lucide-react'; // Example icons

export default function DestinationDetailPage() {
    const pathname = usePathname();
    // Extract the slug from the pathname. Example: /destinations/prishtina -> prishtina
    const slug = pathname.split('/').pop();

    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Only attempt to fetch data if slug is available
        if (!slug) {
            setLoading(false); // If no slug, no data to fetch
            return;
        }

        const fetchDestinationData = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!apiUrl) {
                    throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables.');
                }

                // Make API call to your backend with the specific slug
                const response = await axios.get(`<span class="math-inline">\{apiUrl\}/public/destinations/</span>{slug}`);

                if (response.data.status === 'SUCCESS') {
                    setDestination(response.data.data);
                } else {
                    // Handle cases where the API returns a non-success status
                    throw new Error(response.data.message || 'Failed to fetch destination data.');
                }
            } catch (err) {
                console.error(`Error fetching data for slug "${slug}":`, err);
                setError(err.response?.data?.message || err.message || 'Failed to load destination details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDestinationData();
    }, [slug]); // Re-run effect if slug changes

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-700">Loading destination details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-red-600">Error: {error}</p>
                <p className="text-md text-gray-500">Could not load destination details. Please try again.</p>
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-700">Destination not found.</p>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-8 py-12">
            <section className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
                {/* Hero Image Section */}
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200">
                    <Image
                        src={destination.image || 'https://placehold.co/1200x600/cccccc/333333?text=Destination+Image'}
                        alt={destination.name}
                        fill
                        priority
                        className="object-cover"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/1200x600/cccccc/333333?text=Image+Not+Found';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-8">
                        <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                            {destination.name}
                        </h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 lg:p-12">
                    <div className="flex items-center text-gray-600 mb-4 text-lg">
                        <MapPin className="h-6 w-6 text-blue-500 mr-2" />
                        <span>{destination.region}</span>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed mb-6">
                        {destination.description || 'No detailed description available for this destination.'}
                    </p>

                    {/* Additional Details (Example: if you have attractions, history, etc.) */}
                    {/* You would fetch and display this data if your API provides it */}
                    {destination.attractions && destination.attractions.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Key Attractions</h2>
                            <ul className="list-disc list-inside text-gray-700">
                                {destination.attractions.map((attraction, index) => (
                                    <li key={index}>{attraction}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {destination.history && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">History</h2>
                            <p className="text-gray-700 leading-relaxed">{destination.history}</p>
                        </div>
                    )}

                    {/* Coordinates Display (for debugging or user info) */}
                    {destination.coordinates && destination.coordinates.length === 2 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Location Coordinates</h2>
                            <p className="text-gray-700">
                                Latitude: {destination.coordinates[0]}, Longitude: {destination.coordinates[1]}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}