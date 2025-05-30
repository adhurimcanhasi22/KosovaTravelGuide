'use client';
import React, { useState } from 'react';
import { Plus, Hotel, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input'; // Assuming these are correctly imported from shadcn/ui
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Define accommodation types for the select dropdown
const accommodationTypes = [
  'Hotel',
  'Motel',
  'Resort',
  'Guesthouse',
  'Apartment',
  'Hostel',
  'Other',
];

const AddAccommodationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    type: '',
    price: '',
    rating: '',
    image: '',
    features: '',
    bookingUrl: '', // New field for booking URL
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in.');
      }

      // Send the data to your backend API endpoint
      const response = await fetch('/api/admin/accommodations', {
        // Corrected route to include /api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          location: formData.location,
          type: formData.type,
          price: Number(formData.price), // Ensure price is a number
          rating: formData.rating ? Number(formData.rating) : undefined, // Ensure rating is a number or undefined
          image: formData.image,
          features: formData.features
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item), // Convert features to array
          bookingUrl: formData.bookingUrl, // Include the new field
        }),
      });

      // Parse the JSON response
      const responseData = await response.json();

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500)
        throw new Error(responseData.message || 'Failed to add accommodation');
      }

      // Handle successful accommodation creation
      console.log('Accommodation added successfully:', responseData);
      setSubmitSuccess(true);
      setFormData({
        id: '',
        name: '',
        location: '',
        type: '',
        price: '',
        rating: '',
        image: '',
        features: '',
        bookingUrl: '', // Reset new field
      }); // Reset form
    } catch (error) {
      // Handle errors during the fetch or API call
      setSubmitError(
        error.message || 'An error occurred while adding the accommodation.'
      );
      console.error('Error adding accommodation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Hotel className="w-6 h-6" />
          Add New Accommodation
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <Label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              ID
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Enter accommodation ID (e.g., hotel-name)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Unique identifier for the accommodation.
            </p>
          </div>

          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter accommodation name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location (e.g., City, Region)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="type"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Type
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Enter accommodation type"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </Label>
            <div className="mt-1">
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price per night"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating
            </Label>
            <div className="mt-1">
              <Input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Enter rating (1-5)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </Label>
            <div className="mt-1">
              <Input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="bookingUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Booking URL
            </Label>
            <div className="mt-1">
              <Input
                type="url"
                id="bookingUrl"
                name="bookingUrl"
                value={formData.bookingUrl}
                onChange={handleInputChange}
                placeholder="Enter booking.com URL for this accommodation"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Direct link to the booking page (e.g., booking.com).
            </p>
          </div>

          <div>
            <Label
              htmlFor="features"
              className="block text-sm font-medium text-gray-700"
            >
              Features
            </Label>
            <div className="mt-1">
              <Textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Enter features, separated by commas (e.g., WiFi, Pool, Parking)"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md min-h-[100px]"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              List of features, separated by commas.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer text-white py-2 px-4 rounded-md bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <Plus className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Accommodation'
            )}
          </Button>

          {submitError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}
          {submitSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2"
              role="alert"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="block sm:inline">
                Accommodation added successfully!
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAccommodationPage;
