"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Function to show the dropdown
  const handleMouseEnter = (menu) => {
    clearTimeout(hoverTimeout); // Clear any existing timeout
    setDropdownOpen(menu); // Show the dropdown
  };

  // Function to hide the dropdown with a delay
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(null); // Hide the dropdown after the delay
    }, 300); // Adjust the delay (in milliseconds) as needed
    setHoverTimeout(timeout); // Store the timeout ID
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [router.asPath]);

  const isActive = (path) =>
    router.pathname === path
      ? "text-[var(--enterprise-blue)] font-semibold"
      : "text-[var(--link-color)] hover:text-[var(--enterprise-blue)/90]";

  return (
    <nav
      className={`top-[25px] fixed w-full z-50 transition-all duration-300 
                  backdrop-blur-lg `}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="relative flex h-[5rem] pl-8 pr-6">
          {/* Blurred background wrapper */}
          <div
            className="absolute inset-0 -z-[1] rounded-b-2xl lg:rounded-full 
                        border-2 border-[var(--border-color)] 
                        bg-[rgba(214,215,216,0.25)]"
          />

          <div className="flex items-center justify-between w-full">
            {/* Left Section - Logo */}
            <Link href="/" className="flex items-center gap-4">
              {/* Logo */}
              <img
                src="/images/logo.png" // Replace with your logo file path
                alt="Kosovo Travel Logo"
                className="w-14 h-11" // Adjust size as needed
              />

              {/* Stacked Text */}
              <div className="flex flex-col justify-center">
                <span className="text-[var(--enterprise-blue)] text-3xl font-medium pl-0.5 ">
                  Kosova
                </span>
                <span className="text-[var(--enterprise-blue)] text-lg font-semibold ">
                  Travel Guide
                </span>
              </div>
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-start space-x-9 ml-2 text-base font-semibold">
              {" "}
              {/* Add spacing */}
              <Link href="/" className="navbar-link">
                Home
              </Link>
              {/* Destinations Dropdown */}
              <div
                className="relative cursor-pointer group"
                onMouseEnter={() => handleMouseEnter("destinations")}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/destinations" className="flex items-center gap-2">
                  <span className="navbar-link">Destinations</span>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    className="size-3 transition-transform duration-300 text-enterprise-gray group-hover:-rotate-180"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                  </svg>
                </Link>

                {/* Dropdown Content */}
                <div
                  className={`absolute top-full left-0 mt-0.5 bg-white rounded-lg shadow-lg p-4 w-[200px] z-50 transition-opacity duration-200 ${
                    dropdownOpen === "destinations"
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/destinations/city1"
                        className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                      >
                        City 1
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/destinations/city2"
                        className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                      >
                        City 2
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/destinations/city3"
                        className="text-[var(--link-color)] hover:text-[var(--enterprise-blue)]"
                      >
                        City 3
                      </Link>
                    </li>
                  </ul>
                  {/* Dropdown Content */}
                </div>
              </div>
              {/* Other links */}
              <Link href="/travel-tips" className="navbar-link">
                Travel Tips
              </Link>
              <Link href="/accommodations" className="navbar-link">
                Accommodations
              </Link>
              <Link href="/tours" className="navbar-link">
                Tours
              </Link>
            </div>

            {/* Right Section - Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Login Button */}
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full bg-white font-semibold text-lg 
                         text-[var(--enterprise-blue)] hover:bg-[var(--eggshell)] hover:text-[var(--enterprise-black)] border-3 hover:border-amber-200 transition-all duration-300"
              >
                Login
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-[var(--enterprise-blue)]  font-semibold text-lg 
                         text-white hover:bg-[var(--enterprise-black)] ] border-3 hover:border-amber-200 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "×" : "≡"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden bg-[var(--enterprise-blue)]/90 backdrop-blur-lg 
                          rounded-b-2xl mt-2"
          >
            <div className="flex flex-col space-y-4 p-6">
              <Link href="/" className={`navbar-link ${isActive("/")}`}>
                Home
              </Link>
              <Link
                href="/destinations"
                className={`navbar-link ${isActive("/destinations")}`}
              >
                Destinations
              </Link>
              <Link
                href="/travel-tips"
                className={`navbar-link ${isActive("/travel-tips")}`}
              >
                Travel Tips
              </Link>
              <Link
                href="/accommodations"
                className={`navbar-link ${isActive("/accommodations")}`}
              >
                Accommodations
              </Link>
              <Link
                href="/tours"
                className={`navbar-link ${isActive("/tours")}`}
              >
                Tours
              </Link>
              <div className="flex flex-col gap-4 mt-4">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-full bg-white 
                           text-[var(--enterprise-blue)] hover:bg-gray-100 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-full bg-[var(--enterprise-blue)] 
                           text-white hover:bg-white hover:text-[var(--enterprise-blue)] transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
