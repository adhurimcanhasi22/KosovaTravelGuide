'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const AddCityPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    region: '',
    image: '',
    description: '',
    longDescription: '',
    latitude: '',
    longitude: '',
    attributes: '',
    thingsToDo: '',
    images: '',
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
      const fullUrl = `${apiUrl}/admin/destinations`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          region: formData.region,
          image: formData.image,
          description: formData.description,
          longDescription: formData.longDescription,
          coordinates: {
            lat: Number(formData.latitude),
            lng: Number(formData.longitude),
          },
          attributes: formData.attributes
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
          thingsToDo: formData.thingsToDo
            .split(';')
            .map((item) => {
              const parts = item
                .trim()
                .split(':')
                .map((p) => p.trim());
              return parts.length === 2
                ? { name: parts[0], description: parts[1] }
                : null;
            })
            .filter((item) => item),
          images: formData.images
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = 'Failed to add city/destination';
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
        throw new Error(errorMessage);
      }

      console.log('City/Destination added successfully:', responseData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        slug: '',
        region: '',
        image: '',
        description: '',
        longDescription: '',
        latitude: '',
        longitude: '',
        attributes: '',
        thingsToDo: '',
        images: '',
      });
    } catch (error) {
      let errorMessage = 'An error occurred while adding the city/destination.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmitError(errorMessage);
      console.error('Error adding city/destination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--enterprise-blue)] mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[var(--enterprise-blue)]" />
          Add New City/Destination
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-8 bg-white p-6 rounded-lg shadow-md"
        >
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
                placeholder="Enter city/destination name"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="slug"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Slug
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Enter URL-friendly identifier (e.g., prishtina)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-[var(--enterprise-lightgray)]">
              Unique URL identifier for the city/destination.
            </p>
          </div>

          <div>
            <Label
              htmlFor="region"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Region
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Enter region (e.g., Central Kosovo)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
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
              htmlFor="description"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Short Description
            </Label>
            <div className="mt-1">
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a brief description of the city/destination"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md min-h-[80px]"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="longDescription"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Long Description
            </Label>
            <div className="mt-1">
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="Enter a detailed description of the city/destination"
                rows={5}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md min-h-[120px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="latitude"
                className="block text-sm font-medium text-[var(--enterprise-blue)]"
              >
                Latitude
              </Label>
              <div className="mt-1">
                <Input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="Enter latitude"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="longitude"
                className="block text-sm font-medium text-[var(--enterprise-blue)]"
              >
                Longitude
              </Label>
              <div className="mt-1">
                <Input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Enter longitude"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <Label
              htmlFor="attributes"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Attributes
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="attributes"
                name="attributes"
                value={formData.attributes}
                onChange={handleInputChange}
                placeholder="Enter attributes, separated by commas (e.g., city, historical)"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--enterprise-lightgray)]">
              List of attributes, separated by commas.
            </p>
          </div>

          <div>
            <Label
              htmlFor="thingsToDo"
              className="block text-sm font-medium text-[var(--enterprise-blue)]"
            >
              Things To Do
            </Label>
            <div className="mt-1">
              <Textarea
                id="thingsToDo"
                name="thingsToDo"
                value={formData.thingsToDo}
                onChange={handleInputChange}
                placeholder="Enter things to do, separated by semicolons, with name:description (e.g., Explore Bazaar:Walk through the old bazaar;Visit Library:Admire the architecture)"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-[var(--enterprise-lightblue)] rounded-md min-h-[100px]"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--enterprise-lightgray)]">
              List of things to do, separated by semicolons. Each item should be
              in the format: Name:Description.
            </p>
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
              'Add City/Destination'
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
                City/Destination added successfully!
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCityPage;
