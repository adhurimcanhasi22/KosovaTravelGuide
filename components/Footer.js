'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLinkedinIn } from 'react-icons/fa'; // Import LinkedIn icon

export default function Footer() {
  const [topDestinations, setTopDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [destinationsError, setDestinationsError] = useState(null);

  useEffect(() => {
    const fetchTopDestinations = async () => {
      setLoadingDestinations(true);
      setDestinationsError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL is not defined.');
        }
        const response = await axios.get(
          `${apiUrl}/public/destinations?_sort=createdAt&_limit=6`
        );
        if (response.data.status === 'SUCCESS') {
          setTopDestinations(response.data.data || []);
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch top destinations'
          );
        }
      } catch (err) {
        console.error('Error fetching top destinations:', err);
        setDestinationsError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load destinations.'
        );
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchTopDestinations();
  }, []);

  const firstSixDestinations = topDestinations.slice(0, 6);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-kosovo-yellow">
              Kosovo Travel Guide
            </h3>
            <p className="text-gray-300 mb-4">
              Discover the beauty of Kosovo, Europe's youngest country with rich
              history, stunning landscapes and warm hospitality.
            </p>
            <div className="flex space-x-4 ">
              <a
                href="https://www.facebook.com/profile.php?id=61576798537052"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-xl text-white hover:text-[var(--enterprise-yellow)] transition-colors"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/kosovatravelguide/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-xl text-white hover:text-[var(--enterprise-yellow)]  transition-colors" />{' '}
              </a>
              <a
                href="https://www.instagram.com/kosovatravelguide/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl text-white hover:text-[var(--enterprise-yellow)]  transition-colors"></i>
              </a>
              <a
                href="https://www.youtube.com/@KosovaTravelGuide"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-xl text-white hover:text-[var(--enterprise-yellow)]  transition-colors"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-kosovo-yellow">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/travel-tips"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Travel Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/accommodations"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Accommodations
                </Link>
              </li>
              <li>
                <Link
                  href="/tours"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-kosovo-yellow">
              Top Destinations
            </h3>
            <ul className="space-y-2">
              {loadingDestinations ? (
                <li>Loading destinations...</li>
              ) : destinationsError ? (
                <li>Error loading destinations.</li>
              ) : firstSixDestinations.length > 0 ? (
                firstSixDestinations.map((destination) => (
                  <li key={destination.slug}>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {destination.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No destinations available.</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-kosovo-yellow">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-kosovo-yellow"></i>
                <span className="text-gray-300">
                  Mother Teresa Boulevard, Pristina, Kosova
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <a
                  href="mailto:kosovatravelguide@gmail.com"
                  className="flex items-center space-x-3 text-white transition-colors"
                >
                  <i className="fas fa-envelope mt-1"></i>
                  <span className="text-gray-300 hover:text-[var(--enterprise-yellow)]">
                    kosovatravelguide@gmail.com
                  </span>
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-phone-alt mt-1 text-kosovo-yellow"></i>
                <span className="text-gray-300">+383 46 131 115</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-clock mt-1 text-kosovo-yellow"></i>
                <span className="text-gray-300">
                  Mon - Fri: 9:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Kosovo Travel Guide. All rights
            reserved.
          </p>
          <div className="mt-4 space-x-6">
            <Link
              href="/privacy-policy"
              className="text-white hover:text-[var(--enterprise-yellow)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-service"
              className="text-white hover:text-[var(--enterprise-yellow)] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
