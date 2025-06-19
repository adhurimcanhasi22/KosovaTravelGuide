'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import MyMap from '../../../components/MyMap';
import { MapPin, Star, Landmark, Camera, Info } from 'lucide-react';

export default function DestinationDetailPage() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const [destination, setDestination] = useState(null);
  const [otherDestinations, setOtherDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/public/destinations/${slug}`);
        setDestination(res.data.data);

        const all = await axios.get(`${apiUrl}/public/destinations`);
        const filtered = all.data.data.filter((d) => d.slug !== slug);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setOtherDestinations(shuffled.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error loading destination.</p>
      </div>
    );
  }

  const {
    name,
    region,
    description,
    longDescription,
    coordinates,
    images,
    attributes,
  } = destination;

  return (
    <main className="bg-gray-50">
      <div className="relative h-[400px] w-full">
        <Image
          src={destination.image || 'https://placehold.co/1200x400'}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold shadow-md drop-shadow-lg">
            {name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="text-red-500" />
              <span className="text-sm">{region}</span>
            </div>
            <p className="mt-2 text-gray-800 text-base">{longDescription}</p>
          </div>

          {attributes?.length > 0 && (
            <div className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-lg font-semibold mb-3">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {attributes.map((attr, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    <Star className="h-4 w-4" /> {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {images?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`Image ${i + 1}`}
                  width={500}
                  height={300}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            <div className="h-64 w-full rounded-md overflow-hidden">
              <MyMap
                position={destination.coordinates}
                zoom={13}
                cities={[{ name, slug, coordinates, description }]}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-3">Travel Tips</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Carry cash for rural
                areas.
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Wear comfy shoes for
                exploring.
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Try local dishes and
                snacks.
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Respect local customs
                and language.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Other Destinations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherDestinations.map((d) => (
            <div
              key={d.slug}
              className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center"
            >
              <div className="relative w-full h-[300px]">
                <Image
                  src={
                    d.image ||
                    'https://placehold.co/300x300/cccccc/333333?text=Destination'
                  }
                  alt={d.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-5 flex flex-col text-left flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-black">{d.name}</h3>
                </div>
                <div className="flex items-center text-gray-600 space-x-2">
                  <MapPin className="h-5 w-5 text-red-400" />
                  <span>{d.region}</span>
                </div>
                <p className="text-gray-700 text-sm mt-2 mb-4 line-clamp-3">
                  {d.description || 'No description available.'}
                </p>
                <Link
                  href={`/destinations/${d.slug}`}
                  className="w-full mt-auto cursor-pointer text-white py-2 px-4 rounded-md bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-colors duration-200 text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
