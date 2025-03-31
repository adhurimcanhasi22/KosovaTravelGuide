import Link from "next/link";

export default function Footer() {
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
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-xl hover:text-kosovo-yellow transition-colors"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-xl hover:text-kosovo-yellow transition-colors"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl hover:text-kosovo-yellow transition-colors"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-xl hover:text-kosovo-yellow transition-colors"></i>
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
              <li>
                <Link
                  href="/destinations/pristina"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pristina
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/prizren"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Prizren
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/peja"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Peja
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/gjakova"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gjakova
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/rugova-valley"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Rugova Valley
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/mirusha-waterfalls"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mirusha Waterfalls
                </Link>
              </li>
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
                  Mother Teresa Boulevard, Pristina, Kosovo
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-envelope mt-1 text-kosovo-yellow"></i>
                <span className="text-gray-300">info@kosova-travel.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-phone-alt mt-1 text-kosovo-yellow"></i>
                <span className="text-gray-300">+383 44 123 456</span>
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
            &copy; {new Date().getFullYear()} Kosovo Travel Guide. All rights
            reserved.
          </p>
          <div className="mt-4 space-x-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
