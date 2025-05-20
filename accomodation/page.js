import Image from 'next/image';
import { 
    CalendarDaysIcon,
    WifiIcon,
    FitnessIcon,
    SparklesIcon,
    ForkKnifeIcon,
    FireIcon,
    DropletIcon,
} from '@heroicons/react/24/outline';


export default function AccomodationPage() {
    const hotels = [
    {
      id: 1,
      name: 'Swiss Diamond Hotel',
      city: 'pristina',
      price: 150,
      rating: 4.8,
      type: '5-Star Hotel',
      image: '/images/swissHotel.png',
      amenities: ['Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Free Wifi'],
    },
    {
      id: 2,
      name: 'Hotel Sirius',
      city: 'pristina',
      price: 90,
      rating: 4.8,
      type: '4-Star Hotel',
      image: '/images/hotelSirius.png',
      amenities: ['Restaurant', 'Bar', 'Free Parking', 'Private Events', 'Free Wifi'],
    },
  ];

    return (
    <div className="min-h-screen bg-white">
    <div className="relative h-[350px] w-full">
        <Image
        src="/images/accomodationbg.png"
        alt="Accommodation Background"
        fill
        className="object-cover"
        priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/10">
        <h1 className="text-4xl font-bold drop-shadow-lg">Accommodation in Kosovo</h1>
        <h5 className="text-lg mt-2 drop-shadow-md">Find the best places to stay across the country</h5>
        </div>
    </div>

    <section className="w-full bg-white py-6 px-4 flex justify-center shadow-lg my-1">
    <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
    {/* Search Field */}
    <input
    type="text"
    placeholder="Search accommodations..."
    className="w-full md:w-[300px] px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {/* Dropdown 1 - Select City */}
    <select
    className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
    style={{ maxWidth: '100%' }}
    >
    <option value="">Select City</option>
    <option value="pristina">Pristina</option>
    <option value="peja">Peja</option>
    <option value="gjakova">Gjakova</option>
    </select>
    {/* Dropdown 2 - Filter by Price */}
    <select
    className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-sm"
    style={{ maxWidth: '100%' }}
    >
    <option value="">Filter by Price</option>
    <option value="low-to-high">Low to High</option>
    <option value="high-to-low">High to Low</option>
    </select>
    </div>
</section>
      {/* Hotel Cards Section */}
<section className="w-full bg-white py-10 px-4 shadow-md">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative">
  <div className="relative w-full h-[300px]">
    <Image
      src="/images/swissHotel.png"
      alt="Hotel Example"
      fill
      className="object-cover rounded-t-lg"
    />
    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
      From €150/night
    </div>
  </div>
  <div className="p-5 flex flex-col text-left">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black">Swiss Diamond Hotel</h3>
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
        <span className="text-gray-700 font-medium text-sm">4.8</span>
      </div>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Pristina</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-black"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 21V3h18v18h-2v-2H5v2H3zm4-4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/>
      </svg>
      <span>5-Star Hotel</span>
    </div>

    <hr className="my-4 border-gray-200" />
    <div className="flex flex-wrap gap-2">
      {['Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Free Wifi'].map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
</div>
{/* hotel 2 */}
<div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative">
  <div className="relative w-full h-[300px]">
    <Image
      src="/images/hotelSirius.png"
      alt="Hotel Example"
      fill
      className="object-cover rounded-t-lg"
    />
    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
      From €90/night
    </div>
  </div>
  <div className="p-5 flex flex-col text-left">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black">Hotel Sirius</h3>
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
        <span className="text-gray-700 font-medium text-sm">4.8</span>
      </div>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Pristina</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-black"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 21V3h18v18h-2v-2H5v2H3zm4-4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/>
      </svg>
      <span>4-Star Hotel</span>
    </div>

    <hr className="my-4 border-gray-200" />
    <div className="flex flex-wrap gap-2">
      {['Restaurant', 'Bar', 'Free Parking','Private Events','Free Wifi'].map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
</div>
{/* hotel 3 */}
<div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative">
  <div className="relative w-full h-[300px]">
    <Image
      src="/images/hotelTheranda.png"
      alt="Hotel Example"
      fill
      className="object-cover rounded-t-lg"
    />
    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
      From €75/night
    </div>
  </div>
  <div className="p-5 flex flex-col text-left">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black">Hotel Theranda</h3>
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
        <span className="text-gray-700 font-medium text-sm">4.8</span>
      </div>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Prizren</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-black"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 21V3h18v18h-2v-2H5v2H3zm4-4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/>
      </svg>
      <span>Boutique Hotel</span>
    </div>

    <hr className="my-4 border-gray-200" />
    <div className="flex flex-wrap gap-2">
      {['Historic Building', 'City Center', 'Restaurant','Free Wifi'].map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
</div>
{/* hotel 4 */}
<div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative">
  <div className="relative w-full h-[300px]">
    <Image
      src="/images/resortUjvaraDrinit.png"
      alt="Hotel Example"
      fill
      className="object-cover rounded-t-lg"
    />
    
    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
      From €85/night
    </div>
  </div>

  <div className="p-5 flex flex-col text-left">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black">Resort Ujvara e Drinit</h3>
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
        <span className="text-gray-700 font-medium text-sm">4.8</span>
      </div>
    </div>

    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Peja</span>
    </div>

    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-black"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 21V3h18v18h-2v-2H5v2H3zm4-4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/>
      </svg>
      <span>House</span>
    </div>

    <hr className="my-4 border-gray-200" />
    <div className="flex flex-wrap gap-2">
      {['Family Run', 'Breakfast Included', 'Mountain Views','Free Wifi'].map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>

    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
</div>
{/* hotel 5 */}
<div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative">
  <div className="relative w-full h-[300px]">
    <Image
      src="/images/villagjakova.png"
      alt="Hotel Example"
      fill
      className="object-cover rounded-t-lg"
    />
    
    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
      From €110/night
    </div>
  </div>

  <div className="p-5 flex flex-col text-left">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black">Villa Gjakova</h3>
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
        <span className="text-gray-700 font-medium text-sm">4.8</span>
      </div>
    </div>

    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Gjakova</span>
    </div>

    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-black"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 21V3h18v18h-2v-2H5v2H3zm4-4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/>
      </svg>
      <span>Villa</span>
    </div>

    <hr className="my-4 border-gray-200" />
    <div className="flex flex-wrap gap-2">
      {['Entire House', 'Garden', 'Terrace', 'Free Parking', 'Free Wifi'].map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>

    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
</div>
{/* hotel 6 */}
<div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col text-center relative">
  <div className="relative w-full h-[300px]">
    <Image
      src="/images/rugovaLodge.png"
      alt="Hotel Example"
      fill
      className="object-cover rounded-t-lg"
    />
    
    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-md">
      From €65/night
    </div>
  </div>

  <div className="p-5 flex flex-col text-left">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-black">Rugova Eco Lodge</h3>
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
        </svg>
        <span className="text-gray-700 font-medium text-sm">4.8</span>
      </div>
    </div>

    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Rugova Valley</span>
    </div>

    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-black"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 21V3h18v18h-2v-2H5v2H3zm4-4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"/>
      </svg>
      <span>Eco Lodge</span>
    </div>

    <hr className="my-4 border-gray-200" />
    <div className="flex flex-wrap gap-2">
      {['Mountain Views', 'Hiking Trails', 'Organic Food', 'Camping Spots'].map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>

    <button className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
</div>

    {/* ...hotel cards... */}
    </div>
</section>
    <section className="py-12 px-6 bg-gray-50 w-full">
    <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">

    {/* Swiss Diamond Hotel */}
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
  <img
    src="/images/swissHotel.png"
    alt="Swiss Diamond Hotel"
    className="w-full md:w-1/3 h-full object-cover"
  />
  <div className="p-6 flex-1 relative">
    <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
      €150 <span className="text-sm text-gray-600">per night</span>
    </div>

    <h3 className="text-2xl font-semibold">Swiss Diamond Hotel</h3>
    <div className="flex items-center text-yellow-500 mb-1">
      ★★★★☆ <span className="text-gray-600 ml-2">4.8 out of 5</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Pristina, Kosovo</span>
    </div>
    <div className="flex items-center text-sm text-gray-600 space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-zinc-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 22V2h16v20h-6v-6h-4v6H4zm6-8h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V6z" />
  </svg>
  <span>Luxury Hotel</span>
</div>

    <p className="text-sm text-gray-600 mb-4"></p>
    <p className="text-gray-700 mb-4">
      Experience comfortable and convenient accommodations at Swiss Diamond Hotel. Located in Pristina, this 5-star hotel offers excellent amenities and is perfect for travelers looking for luxury accommodations in Kosovo.
    </p>
    <div className="flex flex-wrap gap-2 text-sm mb-4">
  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h18M3 20h18M4 13c4-3 8 3 12 0" />
    </svg>
    <span>Pool</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
    <span>Spa</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 2v20h1V2H8zM14 2v20h1V2h-1zM18 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span>Restaurant</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="18" y2="12" />
      <rect x="3" y="10" width="3" height="4" />
      <rect x="18" y="10" width="3" height="4" />
    </svg>
    <span>Fitness Center</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0114 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" />
      <circle cx="12" cy="20" r="1" />
    </svg>
    <span>Free WiFi</span>
  </span>
</div>

    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5" />
        Check Availability
      </button>
      <button className="text-blue-500 underline">More Details</button>
    </div>
  </div>
</div>

    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
  <img
    src="/images/hotelSirius.png"
    alt="Hotel Sirius"
    className="w-full md:w-1/3 h-full object-cover"
  />
  <div className="p-6 flex-1 relative">
    <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
      €90 <span className="text-sm text-gray-600">per night</span>
    </div>

    <h3 className="text-2xl font-semibold">Hotel Sirius</h3>
    <div className="flex items-center text-yellow-500 mb-1">
      ★★★★☆ <span className="text-gray-600 ml-2">4.5 out of 5</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Pristina, Kosovo</span>
    </div>
    <div className="flex items-center text-sm text-gray-600 space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-zinc-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 22V2h16v20h-6v-6h-4v6H4zm6-8h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V6z" />
  </svg>
  <span>4-Star Hotel</span>
</div>

    <p className="text-sm text-gray-600 mb-4"></p>
    <p className="text-gray-700 mb-4">
      Experience comfortable and convenient accommodations at Hotel Sirius. Located in Pristina, this 4-star hotel offers excellent amenities and is perfect for travelers looking for quality accommodations in Kosovo.
    </p>
    <div className="flex flex-wrap gap-2 text-sm mb-4">
  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 2v20h1V2H8zM14 2v20h1V2h-1zM18 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span>Restaurant</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 2h10l-3 14h-4l-3-14zM10 20h4v2h-4v-2z" />
    </svg>
    <span>Bar</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2h4a4 4 0 010 8h-4v12H8V2h2z" />
    </svg>
    <span>Free Parking</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0114 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" />
      <circle cx="12" cy="20" r="1" />
    </svg>
    <span>Free WiFi</span>
  </span>
</div>

    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5" />
        Check Availability
      </button>
      <button className="text-blue-500 underline">More Details</button>
    </div>
  </div>
</div>
<div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
  <img
    src="/images/hotelTheranda.png"
    alt="Swiss Diamond Hotel"
    className="w-full md:w-1/3 h-full object-cover"
  />
  <div className="p-6 flex-1 relative">
    <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
      €75 <span className="text-sm text-gray-600">per night</span>
    </div>

    <h3 className="text-2xl font-semibold">Hotel Theranda</h3>
    <div className="flex items-center text-yellow-500 mb-1">
      ★★★★☆ <span className="text-gray-600 ml-2">4.6 out of 5</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Prizren, Kosovo</span>
    </div>
    <div className="flex items-center text-sm text-gray-600 space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-zinc-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 22V2h16v20h-6v-6h-4v6H4zm6-8h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V6z" />
  </svg>
  <span>Boutique Hotel</span>
</div>

    <p className="text-sm text-gray-600 mb-4"></p>
    <p className="text-gray-700 mb-4">
      Experience comfortable and convenient accommodations at Hotel Theranda. Located in Prizren, this Boutique hotel offers excellent amenities and is perfect for travelers looking for luxury accommodations in Kosovo.
    </p>
    <div className="flex flex-wrap gap-2 text-sm mb-4">
  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
    <span>Historic Building</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="4" height="10" />
      <rect x="10" y="7" width="4" height="13" />
      <rect x="17" y="12" width="4" height="8" />
      <path d="M3 10h4M10 7h4M17 12h4" strokeLinecap="square" />
    </svg>
    <span>City Center</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 2v20h1V2H8zM14 2v20h1V2h-1zM18 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span>Restaurant</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
    <span>Free WiFi</span>
  </span>
</div>

    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5" />
        Check Availability
      </button>
      <button className="text-blue-500 underline">More Details</button>
    </div>
  </div>
</div>
<div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
  <img
    src="/images/resortUjvaraDrinit.png"
    alt="Resort Ujvara Drinit"
    className="w-full md:w-1/3 h-full object-cover"
  />
  <div className="p-6 flex-1 relative">
    <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
      €55 <span className="text-sm text-gray-600">per night</span>
    </div>

    <h3 className="text-2xl font-semibold">Resort Ujvara e Drinit</h3>
    <div className="flex items-center text-yellow-500 mb-1">
      ★★★★☆ <span className="text-gray-600 ml-2">4.3 out of 5</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Peja, Kosovo</span>
    </div>
    <div className="flex items-center text-sm text-gray-600 space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-zinc-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 22V2h16v20h-6v-6h-4v6H4zm6-8h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V6z" />
  </svg>
  <span>House</span>
</div>

    <p className="text-sm text-gray-600 mb-4"></p>
    <p className="text-gray-700 mb-4">
      Experience comfortable and convenient accommodations at Resort Ujvara e Drinit. Located in Peja, house offers excellent amenities and is perfect for travelers looking for budget-friendly accommodations in Kosovo.
    </p>
    <div className="flex flex-wrap gap-2 text-sm mb-4">
  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="8" r="2" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="18" cy="8" r="2" />
      <path d="M4 14c1-2 4-2 4-2s3 0 4 2" />
      <path d="M14 14c1-2 4-2 4-2s3 0 4 2" />
    </svg>
    <span>Family Run</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 2v20h1V2H8zM14 2v20h1V2h-1zM18 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span>Breakfast Included</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16l6-6 4 4 6-8 4 8" />
    </svg>
    <span>Mountain Views</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
    <span>Free WiFi</span>
  </span>
</div>

    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5" />
        Check Availability
      </button>
      <button className="text-blue-500 underline">More Details</button>
    </div>
  </div>
</div>
<div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
  <img
    src="/images/villaGjakova.png"
    alt="Villa Gjakova"
    className="w-full md:w-1/3 h-full object-cover"
  />
  <div className="p-6 flex-1 relative">
    <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
      €45 <span className="text-sm text-gray-600">per night</span>
    </div>

    <h3 className="text-2xl font-semibold">Villa Gjakova</h3>
    <div className="flex items-center text-yellow-500 mb-1">
      ★★★★☆ <span className="text-gray-600 ml-2">4.0 out of 5</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Gjakova, Kosovo</span>
    </div>
    <div className="flex items-center text-sm text-gray-600 space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-zinc-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 22V2h16v20h-6v-6h-4v6H4zm6-8h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V6z" />
  </svg>
  <span>Villa</span>
</div>

    <p className="text-sm text-gray-600 mb-4"></p>
    <p className="text-gray-700 mb-4">
      Experience comfortable and convenient accommodations at Villa Gjakova. Located in Gjakove, this Villa offers excellent amenities and is perfect for travelers looking for Cozy accommodations in Kosovo.
    </p>
    <div className="flex flex-wrap gap-2 text-sm mb-4">
  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
    <span>Entire House</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5s-4 0-8 5-8-5-8-5v7c0 6 8 10 8 10z" />
    </svg>
    <span>Garden</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="3" />
      <path d="M2 20h20M4 20v-4h16v4" />
    </svg>
    <span>Terrace</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 3a1 1 0 0 0-1 1v16a1 1 0 0 0 2 0v-6h4a5 5 0 0 0 0-10H5zm2 2h3a3 3 0 0 1 0 6H7V5z"/>
  </svg>
    <span>Free Parking</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
    <span>Free WiFi</span>
  </span>
</div>

    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5" />
        Check Availability
      </button>
      <button className="text-blue-500 underline">More Details</button>
    </div>
  </div>
</div>
<div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
  <img
    src="/images/rugovaLodge.png"
    alt="Rugova Lodge"
    className="w-full md:w-1/3 h-full object-cover"
  />
  <div className="p-6 flex-1 relative">
    <div className="absolute top-6 right-6 text-lg font-bold text-blue-600">
      €70 <span className="text-sm text-gray-600">per night</span>
    </div>

    <h3 className="text-2xl font-semibold">Rugova Lodge</h3>
    <div className="flex items-center text-yellow-500 mb-1">
      ★★★★☆ <span className="text-gray-600 ml-2">4.4 out of 5</span>
    </div>
    <div className="flex items-center text-gray-600 mt-2 space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      </svg>
      <span>Rugova Valley, Kosovo</span>
    </div>
    <div className="flex items-center text-sm text-gray-600 space-x-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-zinc-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 22V2h16v20h-6v-6h-4v6H4zm6-8h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V6z" />
  </svg>
  <span>Eco Lodge</span>
</div>

    <p className="text-sm text-gray-600 mb-4"></p>
    <p className="text-gray-700 mb-4">
      Experience comfortable and convenient accommodations at Rugova Lodge. Located in Rugova Valley, this Eco Lodge offers excellent amenities and is perfect for travelers looking for relaxing accommodations in Kosovo.
    </p>
    <div className="flex flex-wrap gap-2 text-sm mb-4">
  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 20h18L13 6l-4 7-3-5z" />
    </svg>
    <span>Mountain Views</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm1 5h-2v3l-2 3v9h2v-8l1-1 1 1v8h2v-9l-2-3V7z" />
    </svg>
    <span>Hiking Trails</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-lime-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C10 5 6 5 4 7c-2 2-2 6 2 9 1 1 2 2 3 3s2 2 3 3c1-1 2-2 3-3s2-2 3-3c4-3 4-7 2-9-2-2-6-2-8-5z" />
    </svg>
    <span>Organic Food</span>
  </span>

  <span className="bg-gray-200 px-2 py-1 rounded flex items-center space-x-1">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l7 14h-4v6h-6v-6H5l7-14z" />
    </svg>
    <span>Camping Spots</span>
  </span>
</div>

    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        <CalendarDaysIcon className="h-5 w-5" />
        Check Availability
      </button>
      <button className="text-blue-500 underline">More Details</button>
    </div>
  </div>
</div>
    </div>
</section>


<div className="px-4 py-12 bg-white">
  {/* Header */}
  <div className="text-center mb-12">
    <h1 className="text-3xl font-bold text-gray-800">Booking Information</h1>
    <h5 className="text-gray-500 mt-2">
      Important details about booking accommodations in Kosovo
    </h5>
  </div>

  {/* Booking part */}
  <div className="flex flex-wrap justify-center gap-6">
    {/* Card 1 */}
    <div className="bg-blue-50 p-6 rounded shadow w-full max-w-sm min-h-[300px]">
      <div className="text-blue-600 mb-3 text-2xl">📅</div>
      <h3 className="font-semibold text-gray-800 mb-2">Reservation Tips</h3>
      <ul className="text-gray-700 space-y-1 text-sm">
        <li>✅ Book in advance during summer months (June - August)</li>
        <li>✅ Many hotels accept online bookings through international platforms</li>
        <li>✅ For smaller guest houses, calling ahead is recommended</li>
        <li>✅ Confirm if Breakfast is Included in the price</li>
      </ul>
    </div>

    {/* Card 2 */}
    <div className="bg-blue-50 p-6 rounded shadow w-full max-w-sm min-h-[300px]">
      <div className="text-blue-600 mb-3 text-2xl">💳</div>
      <h3 className="font-semibold text-gray-800 mb-2">Payment Information</h3>
      <ul className="text-gray-700 space-y-1 text-sm">
        <li>✅ Major hotels accept credit cards (Visa, Mastercard)</li>
        <li>✅ Smaller accommodations might require cash payment in Euros </li>
        <li>✅ Some places may offer discounts for cash payments</li>
        <li>✅ City tax may be charged separately</li>
      </ul>
    </div>

    {/* Card 3 */}
    <div className="bg-blue-50 p-6 rounded shadow w-full max-w-sm min-h-[300px]">
      <div className="text-blue-600 mb-3 text-2xl">ℹ️</div>
      <h3 className="font-semibold text-gray-800 mb-2">What to Expect</h3>
      <ul className="text-gray-700 space-y-1 text-sm">
        <li>✅ Free WiFi is standard in most accommodations</li>
        <li>✅ Check-in usually after 2:00 PM</li>
        <li>✅ Check-out by 11:00 AM or 12:00 PM</li>
        <li>✅ English is spoken in larger hotels</li>
      </ul>
    </div>
  </div>
</div>

    </div>
    );
}
