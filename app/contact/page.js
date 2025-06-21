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
      <div className="relative h-[40vh] min-h-[500px] bg-[var(--enterprise-lightGray)] flex items-center justify-center">
        <img
          src="https://www.raymond.in/static/media/Contact%20us%20banner%20.7a073f8d0667605662b2.jpg"
          alt="Accommodation Background"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/1200x350/cccccc/333333?text=Accommodation+Background';
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg px-4 py-2 rounded">
            Contact Us
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md">
            We're here to help you plan your perfect Kosovo experience
          </h5>
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

              {/* FAQ Item */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">
                  What languages do your guides speak?
                </h3>
                <p className="text-gray-600">
                  All our guides speak fluent English. We also have guides
                  available who speak German, Italian, French, and Spanish. Just
                  let us know your language preference when booking.{' '}
                </p>
              </div>

              {/* FAQ Item */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">
                  What type of accommodation is provided on multi-day tours?
                </h3>
                <p className="text-gray-600">
                  We use quality 3-4 star hotels or authentic guesthouses,
                  depending on the location and tour type. All accommodations
                  are clean, comfortable, and carefully selected to enhance your
                  experience of Kosovo. Single room supplements are available
                  for solo travelers.
                </p>
              </div>
              {/* FAQ Item */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold">
                  What is your cancellation policy?
                </h3>
                <p className="text-gray-600">
                  For most tours, cancellations made at least 48 hours before
                  the start time receive a full refund. Cancellations less than
                  48 hours in advance are not refundable. Multi-day tours may
                  have different policies, which will be specified in the tour
                  details.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
