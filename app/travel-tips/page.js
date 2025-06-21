'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Lightbulb,
  Globe,
  Plane,
  Thermometer,
  Info,
  BookOpenCheck,
  DollarSign,
  CalendarDays,
  Utensils,
  Users,
  Bus,
  ShieldCheck,
  Wifi,
} from 'lucide-react';
import axios from 'axios'; // Assuming axios is used for fetching data

const TravelTipsPage = () => {
  const [travelTips, setTravelTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTravelTips = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error(
            'NEXT_PUBLIC_API_URL is not defined in your environment.'
          );
        }
        const response = await axios.get(`${apiUrl}/public/traveltips`); // Assuming a public endpoint for travel tips

        if (response.data.status === 'SUCCESS') {
          setTravelTips(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch travel tips'
          );
        }
      } catch (err) {
        console.error('Error fetching travel tips:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load travel tips.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTravelTips();
  }, []);

  // Helper function to render Lucide icon dynamically based on category
  const getIconComponent = (category) => {
    const lowerCaseCategory = category ? category.toLowerCase() : '';
    switch (lowerCaseCategory) {
      case 'visa':
      case 'entry':
        return <Plane className="w-6 h-6 text-blue-600" />; // Lucide Plane
      case 'money':
      case 'currency':
      case 'budget':
        return <DollarSign className="w-6 h-6 text-blue-600" />; // Lucide DollarSign
      case 'time':
      case 'season':
      case 'weather':
      case 'calendar-days':
        return <CalendarDays className="w-6 h-6 text-blue-600" />; // Lucide CalendarDays
      case 'food':
      case 'cuisine':
      case 'food-and-drink':
        return <Utensils className="w-6 h-6 text-blue-600" />; // Lucide Utensils
      case 'people':
      case 'culture':
        return <Users className="w-6 h-6 text-blue-600" />; // Lucide Users
      case 'lightbulb': // Existing case for lightbulb
        return <Lightbulb className="w-6 h-6 text-blue-600" />;
      case 'globe': // Existing case for globe
        return <Globe className="w-6 h-6 text-blue-600" />;
      case 'thermometer': // Existing case for thermometer
        return <Thermometer className="w-6 h-6 text-blue-600" />;
      case 'info': // Existing case for info
        return <Info className="w-6 h-6 text-blue-600" />;
      case 'getting-around': // Existing case for passport
        return <Bus className="w-6 h-6 text-blue-600" />;
      case 'shield': // Existing case for passport
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      case 'wifi': // Existing case for passport
        return <Wifi className="w-6 h-6 text-blue-600" />;
      case 'passport': // Existing case for passport
        return <BookOpenCheck className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />; // Generic info icon for others
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        {' '}
        <img
          src="https://img.cdndtl.co.uk/x1xkqhj4w3lh/73039df1-10b7-4cb1-aad2-e4cd3885a171/863324762917a4442b37c5f1f8ab6c3b/Travel_tips4.jpg?auto=format&s=166d6e2ea31c93a53d71977eeeb97c86"
          alt="Accommodation Background"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/1200x350/cccccc/333333?text=Accommodation+Background';
          }}
        />{' '}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          {' '}
          <h1 className="text-4xl font-bold drop-shadow-lg">
            {' '}
            Travel Tips for Kosovo{' '}
          </h1>{' '}
          <h5 className="text-lg mt-2 drop-shadow-md">
            {' '}
            Everything you need to know for a smooth journey{' '}
          </h5>{' '}
        </div>{' '}
      </div>

      {/* Dynamic Travel Tips Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[var(--enterprise-blue)]">
              Essential Travel Advice
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse our curated tips to make your trip to Kosovo unforgettable.
            </p>
          </div>

          {loading && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-700">Loading travel tips...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-10">
              <p className="text-lg text-red-600">Error: {error}</p>
              <p className="text-md text-gray-500">Please try again later.</p>
            </div>
          )}

          {!loading && !error && travelTips.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-700">
                No travel tips available at the moment.
              </p>
            </div>
          )}

          {!loading && !error && travelTips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {travelTips.map((tip) => (
                <div key={tip.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      {getIconComponent(tip.icon)}{' '}
                      {/* Render icon dynamically using the new function */}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {tip.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">{tip.content}</p>
                  {tip.list && tip.list.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {tip.list.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[var(--enterprise-blue)]">
              Quick Kosovo Info
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Essential information at a glance for your Kosovo trip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Globe className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Country Info
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Capital:</span>
                  <span className="font-medium">Pristina</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Population:</span>
                  <span className="font-medium">~1.8 million</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">10,887 km²</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-medium">Albanian, Serbian</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">Euro (€)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Time Zone:</span>
                  <span className="font-medium">CET (UTC+1)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Plane className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Travel Basics
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Visa:</span>
                  <span className="font-medium">Many countries exempt</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Airport:</span>
                  <span className="font-medium">Pristina International</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Plug Type:</span>
                  <span className="font-medium">C & F (230V)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Driving:</span>
                  <span className="font-medium">Right side</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tipping:</span>
                  <span className="font-medium">5-10% in restaurants</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Drinking Age:</span>
                  <span className="font-medium">18 years</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Thermometer className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Climate</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">Continental</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Summer:</span>
                  <span className="font-medium">22-30°C (Jun-Aug)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Winter:</span>
                  <span className="font-medium">-5 to 5°C (Dec-Feb)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Spring:</span>
                  <span className="font-medium">10-20°C (Mar-May)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Autumn:</span>
                  <span className="font-medium">10-20°C (Sep-Nov)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Rainy Season:</span>
                  <span className="font-medium">April-May, Oct-Nov</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Info className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Useful Info</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Emergency:</span>
                  <span className="font-medium">112</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Police:</span>
                  <span className="font-medium">192</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Ambulance:</span>
                  <span className="font-medium">194</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Fire:</span>
                  <span className="font-medium">193</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tourist Info:</span>
                  <span className="font-medium">+383 38 212 228</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Country Code:</span>
                  <span className="font-medium">+383</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Phrases */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[var(--enterprise-blue)]">
              Basic Albanian Phrases
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learning a few words in Albanian will be appreciated by locals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Greetings & Basics
              </h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Hello</td>
                    <td className="py-2 text-gray-600">
                      Përshëndetje (pair-shen-DET-ye)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Good morning</td>
                    <td className="py-2 text-gray-600">
                      Mirëmëngjes (meer-MENG-yes)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Good evening</td>
                    <td className="py-2 text-gray-600">
                      Mirëmbrëma (meer-MBREM-a)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Goodbye</td>
                    <td className="py-2 text-gray-600">
                      Mirupafshim (meer-oo-PAF-shim)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Yes / No</td>
                    <td className="py-2 text-gray-600">Po / Jo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Useful Phrases
              </h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Thank you</td>
                    <td className="py-2 text-gray-600">
                      Faleminderit (fah-le-min-DEER-it)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Please</td>
                    <td className="py-2 text-gray-600">
                      Ju lutem (yoo LOO-tem)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Excuse me</td>
                    <td className="py-2 text-gray-600">
                      Më falni (muh FAHL-nee)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">I don't understand</td>
                    <td className="py-2 text-gray-600">
                      Nuk kuptoj (nook koop-TOY)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Cheers!</td>
                    <td className="py-2 text-gray-600">Gëzuar! (guh-ZOO-ar)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelTipsPage;
