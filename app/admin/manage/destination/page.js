'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageDestinationsPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmationSlug, setDeleteConfirmationSlug] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editRowSlug, setEditRowSlug] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    slug: '',
    region: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        if (decodedToken.role !== 'admin') {
          router.push('/dashboard');
        } else {
          fetchDestinations(token);
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

  const fetchDestinations = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const response = await fetch(`${apiUrl}/admin/destinations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to fetch destinations');
      }
      const data = await response.json();
      setDestinations(data.data || []);
      console.log('Destinations state updated:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (destination) => {
    setEditRowSlug(destination.slug);
    setEditFormData({
      name: destination.name,
      slug: destination.slug,
      region: destination.region || '',
      image: destination.image || '',
      description: destination.description || '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/destinations/${editRowSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (res.ok) {
        setDestinations((prev) =>
          prev.map((d) => (d.slug === editRowSlug ? data.data : d))
        );
        setEditRowSlug(null);
        setSubmitSuccess(true);
      } else {
        const errorData = await res.json();
        setSubmitError(errorData?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const handleCancelClick = () => {
    setEditRowSlug(null);
  };

  const confirmDelete = (slug) => {
    setDeleteConfirmationSlug(slug);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  const cancelDelete = () => {
    setDeleteConfirmationSlug(null);
  };

  const handleDelete = async (slug) => {
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
      const response = await fetch(`${apiUrl}/admin/destinations/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message ||
            `Failed to delete destination with slug: ${slug}`
        );
      }
      setDestinations((prev) => prev.filter((dest) => dest.slug !== slug));
      setDeleteConfirmationSlug(null);
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err.message);
      console.error(`Error deleting destination with slug ${slug}:`, err);
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
            <MapPin className="w-6 h-6 text-[var(--enterprise-blue)]" />
            Manage Destinations
          </h1>
          <Link
            href="/admin/add/city/"
            className="inline-flex items-center text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] py-2 px-4 rounded-md shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enterprise-blue)] transition-colors duration-200"
          >
            Add New
          </Link>
        </div>

        {loading && <p>Loading destinations...</p>}
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
              Destination deleted successfully!
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
              Destination edited successfully!
            </span>
          </div>
        )}
        {!loading && destinations.length > 0 ? (
          <div className="bg-white shadow-md rounded-md overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((destination) => (
                  <tr key={destination.slug}>
                    {editRowSlug === destination.slug ? (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="slug"
                            value={editFormData.slug}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="region"
                            value={editFormData.region}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="image"
                            value={editFormData.image}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
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
                          {destination.name}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {destination.slug}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {destination.region}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {destination.image}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {destination.description}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={() => handleEditClick(destination)}
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </button>
                          {deleteConfirmationSlug === destination.slug ? (
                            <div className="inline-flex items-center space-x-2">
                              <Button
                                onClick={() => handleDelete(destination.slug)}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-md text-xs cursor-pointer"
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
                              onClick={() => confirmDelete(destination.slug)}
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
          !loading && <p>No destinations found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageDestinationsPage;
