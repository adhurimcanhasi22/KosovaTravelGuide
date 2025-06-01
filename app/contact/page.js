'use client';
import Head from 'next/head';
import { useState } from 'react';
import ContactForm from '../../components/ContactForm';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <Head>
        <title>Contact Us | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Contact the Kosovo Travel Guide team for inquiries, custom tours, or assistance with planning your trip to Kosovo."
        />
      </Head>

      {/* Hero Section Styled Exactly Like Provided Screenshot */}
      <div className="relative h-[40vh] min-h-[400px] bg-[var(--enterprise-lightGray)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--enterprise-gray)]">
            <span className="text-[var(--enterprise-blue)]">Contact Us</span>
          </h1>
          <p className="text-xl text-[var(--enterprise-gray)] mt-4">
            We're here to help you plan your perfect Kosovo experience
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--enterprise-lightGray)] py-4 shadow-md sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-2">
            {['contact', 'offices', 'faq'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[var(--enterprise-lightblue)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'contact' && <i className="fas fa-envelope mr-2"></i>}
                {tab === 'offices' && <i className="fas fa-building mr-2"></i>}
                {tab === 'faq' && (
                  <i className="fas fa-question-circle mr-2"></i>
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <ContactForm />
              </div>
              <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <ul className="space-y-4 text-[var(--enterprise-gray)]">
                  <li>
                    <strong>Address:</strong> Mother Teresa Boulevard, Pristina
                    10000, Kosova
                  </li>
                  <li>
                    <strong>Email:</strong> kosovatravelguide@gmail.com
                  </li>
                  <li>
                    <strong>Phone:</strong> +383 46 131 115
                  </li>
                  <li>
                    <strong>Working Hours:</strong>
                    <br /> Mon-Fri: 9:00 AM - 5:00 PM
                    <br /> Sat-Sun: Closed
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'offices' && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-8 text-[var(--enterprise-lightblue)]">
                Our Offices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Office 1 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold text-xl text-[var(--enterprise-lightblue)] mb-2">
                    Pristina Office
                  </h3>
                  <p className="text-gray-600">
                    Mother Teresa Boulevard, Pristina 10000, Kosova
                  </p>
                  <p className="text-gray-600">Phone: +383 46 131 115</p>
                  <p className="text-gray-600">
                    Email: kosovatravelguide@gmail.com
                  </p>
                </div>

                {/* Office 2 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold text-xl text-[var(--enterprise-lightblue)] mb-2">
                    Prizren Office
                  </h3>
                  <p className="text-gray-600">
                    Shadervan Square, Prizren 20000, Kosova
                  </p>
                  <p className="text-gray-600">Phone: +383 46 131 115</p>
                  <p className="text-gray-600">
                    Email: kosovatravelguide@gmail.com
                  </p>
                </div>

                {/* Office 3 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold text-xl text-[var(--enterprise-lightblue)] mb-2">
                    Mitrovica Office
                  </h3>
                  <p className="text-gray-600">
                    Mbretëresha Teutë Street , Mitrovica 40000, Kosova
                  </p>
                  <p className="text-gray-600">Phone: +383 46 131 115</p>
                  <p className="text-gray-600">
                    Email: kosovatravelguide@gmail.com
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-center mb-8 text-[var(--enterprise-lightblue)]">
                Frequently Asked Questions
              </h2>

              {/* FAQ Item */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">
                  What services do you offer?
                </h3>
                <p className="text-gray-600">
                  Custom itineraries, guided tours, accommodations,
                  transportation, cultural experiences, travel resources.
                </p>
              </div>

              {/* FAQ Item */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">
                  How far in advance should I book a tour?
                </h3>
                <p className="text-gray-600">
                  Ideally 2-3 weeks in advance; 1-2 months for larger groups or
                  custom tours.
                </p>
              </div>

              {/* FAQ Item */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  Bank transfers and cash (in-office bookings).
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
