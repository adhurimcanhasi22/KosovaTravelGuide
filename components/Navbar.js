'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react'; // Import ChevronDown icon
import axios from 'axios'; // For fetching destinations

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu open/close
  const [scrolled, setScrolled] = useState(false); // State for scroll effect on navbar
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for user login status
  const router = useRouter();
  const pathname = usePathname();

  // Desktop dropdown states
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Mobile dropdown states
  const [mobileDestinationsOpen, setMobileDestinationsOpen] = useState(false);
  const [mobileTravelOpen, setMobileTravelOpen] = useState(false); // Add this line
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [destinationsError, setDestinationsError] = useState(null);

  // Function to show the desktop dropdown
  const handleDesktopMouseEnter = (menu) => {
    clearTimeout(hoverTimeout);
    setDesktopDropdownOpen(menu);
  };

  // Function to hide the desktop dropdown with a delay
  const handleDesktopMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDesktopDropdownOpen(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  // Fetch destinations for the mobile dropdown
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingDestinations(true);
      setDestinationsError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL is not defined.');
        }
        const response = await axios.get(`${apiUrl}/public/destinations`);
        if (response.data.status === 'SUCCESS') {
          // Sort by creation date (assuming _id contains timestamp or add a createdAt field to your schema)
          // For simplicity, we'll just take the first 6 as per the request, assuming the backend returns them in a consistent order.
          // If you need a specific order (e.g., by creation date), you'd need to sort here or in the backend.
          setDestinations(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch destinations'
          );
        }
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setDestinationsError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load destinations.'
        );
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchDestinations();
  }, []); // Empty dependency array means this runs once on mount

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const handleLoginEvent = () => {
      const newToken = localStorage.getItem('token');
      setIsLoggedIn(!!newToken);
    };

    window.addEventListener('login', handleLoginEvent);

    return () => {
      window.removeEventListener('login', handleLoginEvent);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Logout failed. Please try again.');
    }
  };

  // Slice the destinations array to show only the first 6
  const limitedDestinations = destinations.slice(0, 6);

  return (
    <nav
      className={`top-[25px] fixed w-full z-5000 transition-all duration-300`}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="relative flex h-[5rem] px-8">
          {/* Blurred background wrapper */}
          <div
            className={`
              absolute inset-0 -z-[1] rounded-full
              border-2 border-[var(--border-color)]
              bg-[rgba(214,215,216,0.25)] shadow-xl backdrop-blur-lg
            `}
          />

          <div className="flex items-center justify-between w-full">
            {/* Left Section - Logo */}
            <Link href="/" className="flex items-center gap-1">
              {/* Logo */}
              <img
                src="/images/logo.png" // Replace with your logo file path
                alt="Kosovo Travel Logo"
                className="w-16 h-18 sm:w-20 sm:h-22" // Adjust size as needed
              />

              {/* Stacked Text */}
              <div className="hidden sm:flex sm:flex-col sm:justify-center sm:pt-10 sm:pr-11">
                <span className="pb-10 flex items-center text-[var(--enterprise-black)] hover:text-[var(--enterprise-lightblue)] text-xl font-bold">
                  Kosova Travel Guide
                </span>
              </div>

              <div className="sm:hidden flex items-center">
                <span className="text-[var(--enterprise-blue)] hover:text-[var(--enterprise-black)] text-xl font-bold">
                  Kosova Travel Guide
                </span>
              </div>
            </Link>

            {/* Center Links (Desktop) */}
            <div className="hidden md:flex items-start space-x-9 mr-2 text-base font-semibold">
              <Link href="/" className="navbar-link">
                Home
              </Link>
              {isLoggedIn && (
                <Link href="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              {/* Destinations Dropdown (Desktop) */}
              {/* Other links (Desktop) */}
              <div
                className="relative cursor-pointer group"
                onMouseEnter={() => handleDesktopMouseEnter('travel')} // Set state to 'travel'
                onMouseLeave={handleDesktopMouseLeave}
              >
                <Link href="#" className="flex items-center gap-2">
                  {' '}
                  {/* No specific main page for 'Travel' */}
                  <span className="navbar-link">Travel</span>
                  <ChevronDown
                    className={`size-3 transition-transform duration-300 text-enterprise-gray ${
                      desktopDropdownOpen === 'travel' // Controlled by 'travel' state
                        ? '-rotate-180'
                        : ''
                    }`}
                  />
                </Link>

                {/* Dropdown Content (Desktop) */}
                <div
                  className={`absolute top-full left-0 mt-0.5 bg-white rounded-lg shadow-lg p-4 w-[200px] z-50 transition-opacity duration-200 ${
                    desktopDropdownOpen === 'travel' // Controlled by 'travel' state
                      ? 'opacity-100 visible'
                      : 'opacity-0 invisible'
                  }`}
                >
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/travel-tips"
                        className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                      >
                        Tips
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/travel-planner"
                        className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                      >
                        Planner
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/booking"
                        className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                      >
                        Booking
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Destinations Dropdown (Desktop) */}
              <div
                className="relative cursor-pointer group"
                onMouseEnter={() => handleDesktopMouseEnter('destinations')}
                onMouseLeave={handleDesktopMouseLeave}
              >
                <Link href="/destinations" className="flex items-center gap-2">
                  <span className="navbar-link">Destinations</span>
                  <ChevronDown
                    className={`size-3 transition-transform duration-300 text-enterprise-gray ${
                      desktopDropdownOpen === 'destinations'
                        ? '-rotate-180'
                        : ''
                    }`}
                  />
                </Link>

                {/* Dropdown Content (Desktop) */}
                <div
                  className={`absolute top-full left-0 mt-0.5 bg-white rounded-lg shadow-lg p-4 w-[200px] z-50 transition-opacity duration-200 ${
                    desktopDropdownOpen === 'destinations'
                      ? 'opacity-100 visible'
                      : 'opacity-0 invisible'
                  }`}
                >
                  <ul className="space-y-2">
                    {loadingDestinations ? (
                      <p className="text-gray-600">Loading...</p>
                    ) : destinationsError ? (
                      <p className="text-red-600">
                        Error loading destinations.
                      </p>
                    ) : limitedDestinations.length > 0 ? (
                      limitedDestinations.map((dest) => (
                        <li key={dest.slug}>
                          <Link
                            href={`/destinations/${dest.slug}`}
                            className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                          >
                            {dest.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-600">
                        No destinations available.
                      </p>
                    )}
                  </ul>
                </div>
              </div>
              <Link href="/accommodations" className="navbar-link">
                Accommodations
              </Link>
              <Link href="/restaurants" className="navbar-link">
                Restaurants
              </Link>
              <Link href="/tours" className="navbar-link">
                Tours
              </Link>
              <Link href="/contact" className="navbar-link">
                Contact
              </Link>
            </div>
            {/* Right Section - Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="cursor-pointer px-4 py-2 mx-10 text-center rounded-full bg-[var(--enterprise-blue)]  font-semibold text-lg
                         text-white hover:bg-[var(--enterprise-black)] border-[var(--enterprise-blue)] border-3 hover:border-amber-200 transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-full bg-white font-semibold text-lg
                         text-[var(--enterprise-blue)] hover:bg-[var(--eggshell)] hover:text-[var(--enterprise-black)] border-3 hover:border-amber-200 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 rounded-full bg-[var(--enterprise-blue)]  font-semibold text-lg
                         text-white hover:bg-[var(--enterprise-black)] border-[var(--enterprise-blue)] border-3 hover:border-amber-200 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[var(--enterprise-blue)] text-4xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? '×' : '≡'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden rounded-t-2xl rounded-b-2xl lg:rounded-full
                        border-2 border-[var(--border-color)] mt-1
                        bg-[rgba(214,215,216,0.25)] backdrop-blur-lg"
          >
            <div className="flex flex-col space-y-4 p-6">
              <Link href="/" className="navbar-link">
                Home
              </Link>
              {isLoggedIn && (
                <Link href="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              {/* Other mobile links */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  {/* Travel text navigates to /travel-tips */}
                  <Link
                    href="/travel-tips"
                    className="navbar-link !mb-0"
                    onClick={() => setIsOpen(false)}
                  >
                    Travel
                  </Link>
                  {/* Chevron toggles dropdown */}
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ml-2 ${
                      mobileTravelOpen ? '-rotate-180' : ''
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent Link navigation
                      setMobileTravelOpen(!mobileTravelOpen);
                    }}
                  />
                </div>
                {mobileTravelOpen && (
                  <div className="pl-4 pt-2 space-y-2">
                    <Link
                      href="/travel-tips"
                      className="block text-[var(--enterprise-blue)] hover:text-[var(--enterprise-lightblue)]"
                      onClick={() => setIsOpen(false)}
                    >
                      Tips
                    </Link>
                    <Link
                      href="/travel-planner"
                      className="block text-[var(--enterprise-blue)] hover:text-[var(--enterprise-lightblue)]"
                      onClick={() => setIsOpen(false)}
                    >
                      Planner
                    </Link>
                    <Link
                      href="/booking"
                      className="block text-[var(--enterprise-blue)] hover:text-[var(--enterprise-lightblue)]"
                      onClick={() => setIsOpen(false)}
                    >
                      Booking
                    </Link>
                  </div>
                )}
              </div>
              {/* Destinations Dropdown (Mobile) */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between cursor-pointer">
                  {/* Destinations text navigates to /destinations */}
                  <Link
                    href="/destinations"
                    className="navbar-link !mb-0"
                    onClick={() => setIsOpen(false)}
                  >
                    Destinations
                  </Link>
                  {/* Chevron toggles dropdown */}
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ml-2 ${
                      mobileDestinationsOpen ? '-rotate-180' : ''
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent Link navigation
                      setMobileDestinationsOpen(!mobileDestinationsOpen);
                    }}
                  />
                </div>
                {mobileDestinationsOpen && (
                  <div className="pl-4 pt-2 space-y-2">
                    {loadingDestinations ? (
                      <p className="text-[var(--enterprise-gray)]">
                        Loading destinations...
                      </p>
                    ) : destinationsError ? (
                      <p className="text-red-600">
                        Error loading destinations.
                      </p>
                    ) : limitedDestinations.length > 0 ? (
                      limitedDestinations.map((dest) => (
                        <Link
                          key={dest.slug}
                          href={`/destinations/${dest.slug}`}
                          className="block text-[var(--enterprise-blue)] hover:text-[var(--enterprise-lightblue)]"
                          onClick={() => setIsOpen(false)}
                        >
                          {dest.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-600">
                        No destinations available.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <Link href="/accommodations" className="navbar-link">
                Accommodations
              </Link>
              <Link href="/restaurants" className="navbar-link">
                Restaurants
              </Link>
              <Link href="/tours" className="navbar-link">
                Tours
              </Link>
              <Link href="/contact" className="navbar-link">
                Contact
              </Link>
              <div className="flex flex-col gap-4 mt-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 mx-10 text-center rounded-full bg-[var(--enterprise-blue)]  font-semibold text-lg
                         text-white hover:bg-[var(--enterprise-black)] border-[var(--enterprise-blue)] border-3 hover:border-amber-200 transition-all duration-300"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 mx-10 text-center rounded-full bg-white font-semibold text-lg
                         text-[var(--enterprise-blue)] hover:bg-[var(--eggshell)] hover:text-[var(--enterprise-black)] border-3 hover:border-amber-200 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-2 mx-10 text-center rounded-full bg-[var(--enterprise-blue)]  font-semibold text-lg
                         text-white hover:bg-[var(--enterprise-black)] border-[var(--enterprise-blue)] border-3 hover:border-amber-200 transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
