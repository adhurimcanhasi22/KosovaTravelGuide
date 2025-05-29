'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react'; // Changed Hotel to Lightbulb
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const AddTravelTipPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    icon: '',
    content: '',
    list: '', // Will be a comma-separated string for input
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        if (decodedToken.role !== 'admin') {
          // Redirect non-admins
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole('');
        router.push('/auth/login');
      }
    } else {
      setUserRole('');
      router.push('/auth/login');
    }
  }, [router]);

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            You do not have permission to access this page.
          </h1>
        </div>
      </div>
    );
  }

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

      // Construct the full URL using NEXT_PUBLIC_API_URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const fullUrl = `${apiUrl}/admin/traveltips`; // Changed API endpoint

      // Send the data to your backend API endpoint
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          id: formData.id,
          title: formData.title,
          icon: formData.icon,
          content: formData.content,
          list: formData.list // Convert comma-separated string to array
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
        }),
      });

      // Parse the JSON response
      const responseData = await response.json();

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500)
        let errorMessage = 'Failed to add travel tip';
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData; // Handle string responses
        }
        throw new Error(errorMessage);
      }

      // Handle successful travel tip creation
      console.log('Travel tip added successfully:', responseData);
      setSubmitSuccess(true);
      setFormData({
        // Reset form
        id: '',
        title: '',
        icon: '',
        content: '',
        list: '',
      });
    } catch (error) {
      // Handle errors during the fetch or API call
      let errorMessage = 'An error occurred while adding the travel tip.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
      console.error('Error adding travel tip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" /> {/* Changed icon */}
          Add New Travel Tip
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
                placeholder="Enter unique ID for the travel tip (e.g., visa-requirements)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Unique identifier for the travel tip.
            </p>
          </div>

          <div>
            <Label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter travel tip title (e.g., Visa Requirements)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700"
            >
              Icon Name
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="Enter icon name (e.g., passport, plane, map-pin)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Name of the icon (e.g., from Lucide React or Font Awesome).
            </p>
          </div>

          <div>
            <Label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </Label>
            <div className="mt-1">
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter the main content/description of the travel tip"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md min-h-[100px]"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="list"
              className="block text-sm font-medium text-gray-700"
            >
              List Items
            </Label>
            <div className="mt-1">
              <Textarea
                id="list"
                name="list"
                value={formData.list}
                onChange={handleInputChange}
                placeholder="Enter list items, separated by commas (e.g., Item 1, Item 2, Item 3)"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md min-h-[100px]"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Optional: Specific points or tips, separated by commas.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <Plus className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Travel Tip'
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
                Travel tip added successfully!
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTravelTipPage;
