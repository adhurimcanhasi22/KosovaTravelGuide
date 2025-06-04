'use client';
import Head from 'next/head';
import CustomTourBookingForm from '../../components/CustomTourBookingForm'; // Import the new form component

export default function BookingPage() {
  return (
    <>
      <Head>
        <title>Custom Tour Booking | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Request a custom tour tailored to your interests and preferences in Kosovo."
        />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[500px] bg-[var(--enterprise-lightGray)] flex items-center justify-center">
        <img
          src="https://images.yourstory.com/cs/2/ba6b0930e8cd11edbf1c2f9de7fdeb77/Untitleddesign38-1721393074408.png?mode=crop&crop=faces&ar=16%3A9&format=auto&w=1920&q=75" // Placeholder image, replace with a suitable one
          alt="Custom Tour Booking Background"
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.src =
              'https://placehold.co/1200x350/cccccc/333333?text=Custom+Tour+Booking+Background';
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/25">
          <h1 className="text-4xl font-bold drop-shadow-lg px-4 py-2 rounded">
            Book Your Custom Tour
          </h1>
          <h5 className="text-lg mt-2 drop-shadow-md">
            Let us craft your perfect adventure in Kosovo
          </h5>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="section bg-gray-50 py-12">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Tell Us About Your Dream Tour
            </h2>
            <CustomTourBookingForm /> {/* Render the new form component */}
          </div>
        </div>
      </section>
    </>
  );
}
