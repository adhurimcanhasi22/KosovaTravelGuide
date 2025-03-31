"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [router.asPath]);

  const isActive = (path) =>
    router.pathname === path
      ? "text-[var(--enterprise-yellow)] font-semibold"
      : "text-[var(--link-color)] hover:text-[var(--enterprise-yellow)/90]";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-[var(--enterprise-blue)]/90 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="relative flex h-[5rem] pl-8 pr-6">
          {/* Blurred background wrapper */}
          <div
            className="absolute inset-0 -z-[1] rounded-b-2xl lg:rounded-full 
              border border-[var(--border-color)] bg-[var(--navbar-gradient)] 
              backdrop-blur-lg"
          />

          <div className="flex items-center justify-between w-full">
            {/* Left Section - Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Your logo SVG here */}
              </svg>
              <span className="text-white text-xl font-bold">
                Kosovo Travel
              </span>
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center space-x-6 mx-auto">
              <Link href="/" className={`navbar-link ${isActive("/")}`}>
                Home
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setDropdownOpen("destinations")}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <span className="navbar-link flex items-center gap-2">
                  Destinations
                  <svg className="w-3 h-3 text-white" viewBox="0 0 448 512">
                    {/* Chevron SVG */}
                  </svg>
                </span>
                {dropdownOpen === "destinations" && (
                  <div
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg 
                                  shadow-lg p-4 w-[200px]"
                  >
                    {/* Dropdown content */}
                  </div>
                )}
              </div>

              {/* Other links */}
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
            </div>

            {/* Right Section - Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full bg-white 
                         text-[var(--enterprise-blue)] hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-[var(--enterprise-black)] 
                         text-white hover:bg-opacity-80"
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
                           text-[var(--enterprise-blue)] hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-full bg-[var(--enterprise-black)] 
                           text-white hover:bg-opacity-80"
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
