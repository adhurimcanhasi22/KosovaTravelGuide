'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Hotel, AlertCircle, CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageAccommodationsPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
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
    price: '',
    rating: '',
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
          fetchAccommodations(token);
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

  const fetchAccommodations = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const response = await fetch(`${apiUrl}/admin/accommodations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to fetch accommodations');
      }
      const data = await response.json();
      setAccommodations(data.data || []);
      console.log('Accommodations state updated:', data); // Add this line
    } catch (err) {
      setError(err.message);
      console.error('Error fetching accommodations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (accommodation) => {
    setEditRowId(accommodation.id);
    setEditFormData({
      id: accommodation.id,
      name: accommodation.name,
      location: accommodation.location,
      type: accommodation.type,
      price: accommodation.price,
      rating: accommodation.rating,
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
      const res = await fetch(`${apiUrl}/admin/accommodations/${editRowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (res.ok) {
        // Refresh the data or update it locally
        // Example:
        setAccommodations((prev) =>
          prev.map((a) => (a.id === editRowId ? data.data : a))
        );
        setEditRowId(null);
        setSubmitSuccess(true);
      } else {
        setSubmitError(errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
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
      const response = await fetch(`${apiUrl}/admin/accommodations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `Failed to delete accommodation with ID: ${id}`
        );
      }
      setAccommodations((prev) => prev.filter((acc) => acc.id !== id));
      setDeleteConfirmationId(null);
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err.message);
      console.error(`Error deleting accommodation with ID ${id}:`, err);
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
            <Hotel className="w-6 h-6 text-[var(--enterprise-blue)]" />
            Manage Accommodations
          </h1>
          <Link
            href="/admin/add/accommodation/"
            className="inline-flex items-center text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] py-2 px-4 rounded-md shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enterprise-blue)] transition-colors duration-200"
          >
            Add New
          </Link>
        </div>

        {loading && <p>Loading accommodations...</p>}
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
              Accommodation deleted successfully!
            </span>
          </div>
        )}
        {/* ✅ Messages */}
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
              Accommodation edited successfully!
            </span>
          </div>
        )}
        {!loading && accommodations.length > 0 ? (
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
                    Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {accommodations.map((accommodation) => (
                  <tr key={accommodation.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {accommodation._id}
                    </td>

                    {editRowId === accommodation.id ? (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="id"
                            value={editFormData.id}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
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
                            name="location"
                            value={editFormData.location}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="type"
                            value={editFormData.type}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
                            name="price"
                            value={editFormData.price}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            type="number"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <input
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
                          {accommodation.id}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {accommodation.name}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {accommodation.location}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {accommodation.type}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          ${accommodation.price}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {accommodation.rating}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={() => handleEditClick(accommodation)}
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </button>
                          {deleteConfirmationId === accommodation.id ? (
                            <div className="inline-flex items-center space-x-2">
                              <Button
                                onClick={() => handleDelete(accommodation.id)}
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
                              onClick={() => confirmDelete(accommodation.id)}
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
          !loading && <p>No accommodations found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageAccommodationsPage;
