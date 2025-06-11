'use client';
import React, { useState } from 'react';
import {
  Plus,
  Utensils,
  AlertCircle,
  CheckCircle,
  ChefHat,
  Euro,
} from 'lucide-react'; // Changed icon from Hotel to Utensils/ChefHat
import { Input } from '@/components/ui/input';
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

// Define restaurant types for the select dropdown
const restaurantTypes = [
  'Restaurant',
  'Cafe',
  'Bar',
  'Bakery',
  'Street Food',
  'Pizzeria',
  'Fine Dining',
  'Other',
];

// Define price ranges for the select dropdown
const priceRanges = ['€ (Cheap)', '€€ (Moderate)', '€€€ (Expensive)'];

const AddRestaurantPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    type: '',
    cuisine: '', // New field
    priceRange: '', // New field
    rating: '',
    image: '',
    description: '', // New field
    tripadvisorUrl: '', // New field
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle Select component changes (for type and priceRange)
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const fullUrl = `${apiUrl}/admin/restaurants`; // Changed endpoint to /admin/restaurants

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          location: formData.location,
          type: formData.type,
          cuisine: formData.cuisine, // Include new fields
          priceRange: formData.priceRange, // Include new fields
          rating: formData.rating ? Number(formData.rating) : undefined,
          image: formData.image,
          description: formData.description, // Include new fields
          tripadvisorUrl: formData.tripadvisorUrl, // Include new fields
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add restaurant');
      }

      console.log('Restaurant added successfully:', responseData);
      setSubmitSuccess(true);
      // Reset form to initial empty state
      setFormData({
        id: '',
        name: '',
        location: '',
        type: '',
        cuisine: '',
        priceRange: '',
        rating: '',
        image: '',
        description: '',
        tripadvisorUrl: '',
      });
    } catch (error) {
      setSubmitError(
        error.message || 'An error occurred while adding the restaurant.'
      );
      console.error('Error adding restaurant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Utensils className="w-6 h-6" /> {/* Changed icon */}
          Add New Restaurant
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-8 bg-white p-6 rounded-lg shadow-md"
        >
          {/* ID */}
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
                placeholder="Enter restaurant ID (e.g., local-eatery-name)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Unique identifier for the restaurant.
            </p>
          </div>

          {/* Name */}
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
                placeholder="Enter restaurant name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Location */}
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
                placeholder="Enter location (e.g., Prishtina, City Center)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Type (Dropdown) */}
          <div>
            <Label
              htmlFor="type"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Type
            </Label>
            <div className="mt-1">
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
                required
              >
                <SelectTrigger className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md">
                  <SelectValue placeholder="Select type (e.g., Restaurant, Cafe)" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantTypes.map((typeOption) => (
                    <SelectItem key={typeOption} value={typeOption}>
                      {typeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Examples: Restaurant, Cafe, Bar, Bakery, Street Food, Pizzeria,
              Fine Dining.
            </p>
          </div>

          {/* Cuisine */}
          <div>
            <Label
              htmlFor="cuisine"
              className="block text-sm font-medium text-gray-700"
            >
              Cuisine
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleInputChange}
                placeholder="Enter cuisine type (e.g., Albanian, Italian, Vegan)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Optional: e.g., Albanian, Italian, Balkan, Fast Food.
            </p>
          </div>

          {/* Price Range (Dropdown) */}
          <div>
            <Label
              htmlFor="priceRange"
              className="block text-sm font-medium text-gray-700"
            >
              Price Range
            </Label>
            <div className="mt-1">
              <Select
                name="priceRange"
                value={formData.priceRange}
                onValueChange={(value) =>
                  handleSelectChange('priceRange', value)
                }
              >
                <SelectTrigger className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <SelectValue placeholder="Select price range (€, €€, €€€)" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range.split(' ')[0]}>
                      {' '}
                      {/* Store only the € part */}
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
              <Euro className="h-4 w-4 text-gray-500" />
              Optional: € (Cheap), €€ (Moderate), €€€ (Expensive).
            </p>
          </div>

          {/* Rating */}
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
                placeholder="Enter rating (0-5)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Optional: Numeric rating from 0 to 5.
            </p>
          </div>

          {/* Image URL */}
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
            <p className="mt-2 text-sm text-gray-500">
              Optional: Direct URL to the restaurant's image.
            </p>
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <div className="mt-1">
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a brief description of the restaurant"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md min-h-[100px]"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Required: A brief overview of the restaurant, its ambiance, and
              specialities.
            </p>
          </div>

          {/* TripAdvisor URL */}
          <div>
            <Label
              htmlFor="tripadvisorUrl"
              className="block text-sm font-medium text-gray-700"
            >
              TripAdvisor URL
            </Label>
            <div className="mt-1">
              <Input
                type="url"
                id="tripadvisorUrl"
                name="tripadvisorUrl"
                value={formData.tripadvisorUrl}
                onChange={handleInputChange}
                placeholder="Enter TripAdvisor URL for this restaurant"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Optional: Direct link to the restaurant's page on TripAdvisor.
            </p>
          </div>

          {/* Submit Button */}
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
              'Add Restaurant'
            )}
          </Button>

          {/* Submission Feedback */}
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
                Restaurant added successfully!
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantPage;
