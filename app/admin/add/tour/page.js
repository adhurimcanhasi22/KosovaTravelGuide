'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const AddTourPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: '',
    duration: '',
    groupSize: '',
    price: '',
    description: '',
    date: '', // For the specific tour date
    location: '', // General location of the tour
    images: '', // Multiple image URLs
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        if (decodedToken.role !== 'admin') {
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
          <h1 className="text-3xl font-bold text-[var(--enterprise-blue)] mb-6">
            You do not have permission to access this page.
          </h1>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      const fullUrl = `${apiUrl}/admin/tours`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          image: formData.image,
          duration: formData.duration,
          groupSize: Number(formData.groupSize),
          price: Number(formData.price),
          description: formData.description,
          date: formData.date,
          location: formData.location,
          images: formData.images
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to add tour';
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
        throw new Error(errorMessage);
      }

      console.log('Tour added successfully:', responseData);
      setSubmitSuccess(true);
      setFormData({
        id: '',
        name: '',
        image: '',
        duration: '',
        groupSize: '',
        price: '',
        description: '',
        date: '',
        location: '',
        images: '',
      });
    } catch (error) {
      let errorMessage = 'An error occurred while adding the tour.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
      console.error('Error adding tour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--enterprise-blue)] mb-6 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-[var(--enterprise-blue)]" />
          Add New Tour
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <Label
              htmlFor="id"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
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
                placeholder="Enter tour ID (e.g., kosovo-adventure)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-[var(--enterprise-lightgray)]">
              Unique identifier for the tour.
            </p>
          </div>

          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
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
                placeholder="Enter tour name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="image"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="duration"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Duration
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Enter tour duration (e.g., 3 days, 1 week)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="groupSize"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Group Size
            </Label>
            <div className="mt-1">
              <Input
                type="number"
                id="groupSize"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
                placeholder="Enter maximum group size"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="price"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
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
                placeholder="Enter price per person"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="date"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Date
            </Label>
            <div className="mt-1">
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Select tour date"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-[var(--enterprise-lightgray)]">
              The specific date this tour will occur.
            </p>
          </div>

          <div>
            <Label
              htmlFor="location"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
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
                placeholder="Enter the general location of the tour"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Description
            </Label>
            <div className="mt-1">
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description of the tour"
                rows={5}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md min-h-[120px]"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="images"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Image URLs
            </Label>
            <div className="mt-1">
              <Textarea
                id="images"
                name="images"
                value={formData.images}
                onChange={handleInputChange}
                placeholder="Enter image URLs, separated by commas"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md min-h-[80px]"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--enterprise-lightgray)]">
              List of image URLs, separated by commas.
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
              'Add Tour'
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
              <span className="block sm:inline">Tour added successfully!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTourPage;
