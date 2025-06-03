'use client';
import { useState } from 'react';
import TravelTip from '../../components/TravelTip';
//import { travelTips } from '../../lib/destinations';

export default function TravelTipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTips, setFilteredTips] = useState(travelTips);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredTips(travelTips);
    } else {
      const filtered = travelTips.filter((tip) =>
        tip.title.toLowerCase().includes(term) ||
        tip.content.toLowerCase().includes(term) ||
        (tip.list && tip.list.some((item) => item.toLowerCase().includes(term)))
      );
      setFilteredTips(filtered);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] bg-[var(--enterprise-lightGray)] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--enterprise-lightblue)] mb-4">
            Travel Tips
          </h1>
          <p className="text-xl text-[var(--enterprise-gray)] max-w-3xl mx-auto">
            Essential advice to help you plan and enjoy your journey through Kosovo
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white py-6 shadow-md sticky top-0 z-20">
        <div className="container-custom max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search travel tips..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--enterprise-lightblue)] focus:border-[var(--enterprise-lightblue)]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Tips Grid */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-10 text-[var(--enterprise-lightblue)]">
            Explore Practical Travel Advice
          </h2>

          {filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTips.map((tip) => (
                <TravelTip key={tip.id} tip={tip} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2 text-[var(--enterprise-blue)]">No tips found</h3>
              <p className="text-gray-600 mb-4">Try a different keyword or reset the search.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredTips(travelTips);
                }}
                className="btn-secondary"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[var(--enterprise-lightblue)] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need more guidance?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Reach out to us or explore our travel services to plan the perfect trip to Kosovo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/contact"
              className="btn bg-white text-[var(--enterprise-lightblue)] hover:bg-gray-100"
            >
              <i className="fas fa-envelope mr-2"></i> Contact Us
            </a>
            <a
              href="/tours"
              className="btn border-2 border-white text-white hover:bg-white/10"
            >
              <i className="fas fa-map-signs mr-2"></i> Browse Tours
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
