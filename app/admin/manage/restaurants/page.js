'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
import {
  Utensils,
  AlertCircle,
  CheckCircle,
  Plus,
  ChefHat,
  Euro,
} from 'lucide-react'; // Changed icon from Hotel to Utensils/ChefHat
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageRestaurantsPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [restaurants, setRestaurants] = useState([]); // Changed from accommodations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({
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

  // Define restaurant types for the select dropdown (from Add page)
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

  // Define price ranges for the select dropdown (from Add page)
  const priceRanges = ['€ (Cheap)', '€€ (Moderate)', '€€€ (Expensive)'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        if (decodedToken.role !== 'admin') {
          router.push('/dashboard');
        } else {
          fetchRestaurants(token); // Changed from fetchAccommodations
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

  // Changed from fetchAccommodations
  const fetchRestaurants = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const response = await fetch(`${apiUrl}/admin/restaurants`, {
        // Changed endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to fetch restaurants'); // Changed message
      }
      const data = await response.json();
      setRestaurants(data.data || []); // Changed state update
      console.log('Restaurants state updated:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching restaurants:', err); // Changed message
    } finally {
      setLoading(false);
    }
  };

  // Changed from handleEditClick
  const handleEditClick = (restaurant) => {
    setEditRowId(restaurant.id);
    setEditFormData({
      id: restaurant.id,
      name: restaurant.name,
      location: restaurant.location,
      type: restaurant.type,
      cuisine: restaurant.cuisine || '', // New field, handle optional
      priceRange: restaurant.priceRange || '', // New field, handle optional
      rating: restaurant.rating,
      image: restaurant.image,
      description: restaurant.description, // New field
      tripadvisorUrl: restaurant.tripadvisorUrl || '', // New field, handle optional
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Select component changes (for type and priceRange)
  const handleSelectChange = (name, value) => {
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Changed from handleSaveClick
  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/restaurants/${editRowId}`, {
        // Changed endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editFormData.id,
          name: editFormData.name,
          location: editFormData.location,
          type: editFormData.type,
          cuisine: editFormData.cuisine, // Send new fields
          priceRange: editFormData.priceRange, // Send new fields
          rating: Number(editFormData.rating),
          image: editFormData.image,
          description: editFormData.description, // Send new fields
          tripadvisorUrl: editFormData.tripadvisorUrl, // Send new fields
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRestaurants(
          (prev) => prev.map((r) => (r.id === editRowId ? data.data : r)) // Changed state update
        );
        setEditRowId(null);
        setSubmitSuccess(true);
        setSubmitError(null);
      } else {
        setSubmitError(data.message || 'Failed to update restaurant'); // Changed message
        setSubmitSuccess(false);
      }
    } catch (err) {
      console.error('Error saving restaurant:', err); // Changed message
      setSubmitError(
        err.message || 'Something went wrong while saving restaurant' // Changed message
      );
      setSubmitSuccess(false);
    }
  };

  const handleCancelClick = () => {
    setEditRowId(null);
  };

  const confirmDelete = (id) => {
    setDeleteConfirmationId(id);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const cancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  // Changed from handleDelete
  const handleDelete = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing.');
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const response = await fetch(`${apiUrl}/admin/restaurants/${id}`, {
        // Changed endpoint
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `Failed to delete restaurant with ID: ${id}` // Changed message
        );
      }
      setRestaurants((prev) => prev.filter((r) => r.id !== id)); // Changed state update
      setDeleteConfirmationId(null);
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err.message);
      console.error(`Error deleting restaurant with ID ${id}:`, err); // Changed message
    } finally {
      setIsDeleting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[var(--enterprise-blue)] flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[var(--enterprise-blue)]" />
            Manage Restaurants
          </h1>
          <Link
            href="/admin/add/restaurant"
            className="inline-flex items-center text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] py-2 px-4 rounded-md shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enterprise-blue)] transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        {loading && <p>Loading restaurants...</p>}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 mb-4"
            role="alert"
          >
            <AlertCircle className="h-5 w-5" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {deleteError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 mb-4"
            role="alert"
          >
            <AlertCircle className="h-5 w-5" />
            <span className="block sm:inline">{deleteError}</span>
          </div>
        )}
        {deleteSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2 mb-4"
            role="alert"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="block sm:inline">
              Restaurant deleted successfully! {/* Changed message */}
            </span>
          </div>
        )}
        {submitError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 mb-4"
            role="alert"
          >
            <AlertCircle className="h-5 w-5" />
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}
        {submitSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2 mb-4"
            role="alert"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="block sm:inline">
              Restaurant edited successfully!
            </span>
          </div>
        )}
        {!loading && restaurants.length > 0 ? (
          <div className="bg-white shadow-md rounded-md overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ObjectID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cuisine
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image URL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    TripAdvisor URL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {restaurant._id}
                    </td>

                    {editRowId === restaurant.id ? (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="id"
                            value={editFormData.id}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="location"
                            value={editFormData.location}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Select
                            value={editFormData.type}
                            onValueChange={(value) =>
                              handleSelectChange('type', value)
                            }
                          >
                            <SelectTrigger className="w-full border px-2 py-1">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {restaurantTypes.map((typeOption) => (
                                <SelectItem key={typeOption} value={typeOption}>
                                  {typeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="cuisine"
                            value={editFormData.cuisine}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Select
                            value={editFormData.priceRange}
                            onValueChange={(value) =>
                              handleSelectChange('priceRange', value)
                            }
                          >
                            <SelectTrigger className="w-full border px-2 py-1">
                              <SelectValue placeholder="Select price range" />
                            </SelectTrigger>
                            <SelectContent>
                              {priceRanges.map((range) => (
                                <SelectItem
                                  key={range}
                                  value={range.split(' ')[0]}
                                >
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="rating"
                            value={editFormData.rating}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="image"
                            value={editFormData.image}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            type="url"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            rows={2}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="tripadvisorUrl"
                            value={editFormData.tripadvisorUrl}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            type="url"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={handleSaveClick}
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="cursor-pointer text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.id}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.name}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.location}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.type}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.cuisine}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.priceRange}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {restaurant.rating}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm break-all max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {restaurant.image}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm break-all max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {restaurant.description}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm break-all max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {restaurant.tripadvisorUrl}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={() => handleEditClick(restaurant)}
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </button>
                          {deleteConfirmationId === restaurant.id ? (
                            <div className="inline-flex items-center space-x-2">
                              <Button
                                onClick={() => handleDelete(restaurant.id)}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md text-xs"
                              >
                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                              </Button>
                              <Button
                                onClick={cancelDelete}
                                disabled={isDeleting}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => confirmDelete(restaurant.id)}
                              disabled={isDeleting}
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageRestaurantsPage;
