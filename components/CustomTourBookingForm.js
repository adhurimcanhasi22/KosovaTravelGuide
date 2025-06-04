'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  Users,
  MapPin,
  Tag,
  MessageSquare,
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'; // Import relevant icons

export default function CustomTourBookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    desiredDestinations: [], // Array to hold selected destinations
    preferredDates: '', // Could be a date range string
    numTravelers: '',
    interests: [], // Array to hold selected interests
    budget: '',
    additionalNotes: '',
  });

  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [destinationsError, setDestinationsError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Fetch destinations for the dropdown
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
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'desiredDestinations' || name === 'interests') {
      // Handle multiple selections for checkboxes
      let updatedArray = [...formData[name]];
      if (checked) {
        updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter((item) => item !== value);
      }
      setFormData({ ...formData, [name]: updatedArray });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null); // Clear previous status

    try {
      // Form validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.numTravelers ||
        formData.desiredDestinations.length === 0
      ) {
        throw new Error(
          'Please fill all required fields: Name, Email, Number of Travelers, and at least one Desired Destination.'
        );
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Please enter a valid email address.');
      }
      if (
        isNaN(parseInt(formData.numTravelers)) ||
        parseInt(formData.numTravelers) <= 0
      ) {
        throw new Error('Number of travelers must be a positive number.');
      }

      // Construct the subject and message for the email
      const subject = `Custom Tour Inquiry from ${formData.name}`;
      const messageBody = `
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Desired Destinations:</strong> ${
          formData.desiredDestinations.join(', ') || 'N/A'
        }</p>
        <p><strong>Preferred Dates:</strong> ${
          formData.preferredDates || 'Flexible'
        }</p>
        <p><strong>Number of Travelers:</strong> ${formData.numTravelers}</p>
        <p><strong>Interests:</strong> ${
          formData.interests.join(', ') || 'N/A'
        }</p>
        <p><strong>Budget:</strong> ${formData.budget || 'N/A'}</p>
        <p><strong>Additional Notes:</strong></p>
        <p>${formData.additionalNotes || 'No additional notes.'}</p>
      `;

      // Send data to your backend API endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/contact`, // Use the existing contact endpoint
        {
          name: formData.name,
          email: formData.email,
          subject: subject,
          message: messageBody, // Send the constructed HTML message
        }
      );

      if (response.data.status === 'SUCCESS') {
        setSubmitStatus({
          type: 'success',
          message:
            response.data.message ||
            'Your custom tour inquiry has been sent successfully! We will get back to you soon.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          desiredDestinations: [],
          preferredDates: '',
          numTravelers: '',
          interests: [],
          budget: '',
          additionalNotes: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message:
            response.data.message ||
            'Something went wrong. Please try again later.',
        });
      }
    } catch (error) {
      console.error('Custom tour inquiry submission error:', error);
      setSubmitStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          error.message ||
          'Something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);

      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  const interestOptions = [
    'History',
    'Adventure',
    'Food',
    'Culture',
    'Nature',
    'Photography',
    'Relaxation',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus && (
        <div
          className={`border-l-4 p-4 rounded-md ${
            submitStatus.type === 'success'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-red-500 bg-red-50 text-red-700'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{submitStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Your Email *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Send className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="numTravelers"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Travelers *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="number"
            id="numTravelers"
            name="numTravelers"
            value={formData.numTravelers}
            onChange={handleChange}
            required
            min="1"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g., 2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Desired Destinations *
        </label>
        {loadingDestinations ? (
          <p className="text-gray-600">Loading destinations...</p>
        ) : destinationsError ? (
          <p className="text-red-600">Error loading destinations.</p>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {destinations.map((dest) => (
              <div key={dest.slug} className="flex items-center">
                <input
                  id={`dest-${dest.slug}`}
                  name="desiredDestinations"
                  type="checkbox"
                  value={dest.name}
                  checked={formData.desiredDestinations.includes(dest.name)}
                  onChange={handleChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor={`dest-${dest.slug}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {dest.name}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No destinations available.</p>
        )}
      </div>

      <div>
        <label
          htmlFor="preferredDates"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred Dates (Optional)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarDays
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            id="preferredDates"
            name="preferredDates"
            value={formData.preferredDates}
            onChange={handleChange}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g., June 15 - June 22, 2025"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests (Optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {interestOptions.map((interest) => (
            <div key={interest} className="flex items-center">
              <input
                id={`interest-${interest}`}
                name="interests"
                type="checkbox"
                value={interest}
                checked={formData.interests.includes(interest)}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`interest-${interest}`}
                className="ml-2 block text-sm text-gray-900"
              >
                {interest}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-700"
        >
          Budget (Optional)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="e.g., €1000 - €1500 per person"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="additionalNotes"
          className="block text-sm font-medium text-gray-700"
        >
          Additional Notes (Optional)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
            <MessageSquare
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows="4"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Any specific requests or details?"
          ></textarea>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full py-2 px-4 rounded-md text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--enterprise-blue)] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending Inquiry...
            </span>
          ) : (
            'Send Custom Tour Inquiry'
          )}
        </button>
      </div>
    </form>
  );
}
