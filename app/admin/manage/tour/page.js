'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarDays, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageToursPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tours, setTours] = useState([]);
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
    duration: '',
    groupSize: '',
    price: '',
    location: '',
    highlights: '',
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
          fetchTours(token);
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

  const fetchTours = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const response = await fetch(`${apiUrl}/admin/tours`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to fetch tours');
      }
      const data = await response.json();
      setTours(data.data || []);
      console.log('Tours state updated:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tour) => {
    setEditRowId(tour.id);
    setEditFormData({
      id: tour.id,
      name: tour.name,
      duration: tour.duration || '',
      groupSize: tour.groupSize ? String(tour.groupSize) : '',
      price: tour.price ? String(tour.price) : '',
      location: tour.location || '',
      // Removed: date from editFormData
      highlights: tour.highlights ? tour.highlights.join(', ') : '', // Convert array to comma-separated string
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
      const res = await fetch(`${apiUrl}/admin/tours/${editRowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editFormData.name,
          duration: editFormData.duration,
          groupSize: Number(editFormData.groupSize),
          price: Number(editFormData.price),
          location: editFormData.location,
          // Removed: date from body
          highlights: editFormData.highlights // Convert comma-separated string to array for backend
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTours((prev) =>
          prev.map((t) => (t.id === editRowId ? data.data : t))
        );
        setEditRowId(null);
        setSubmitSuccess(true);
      } else {
        const errorData = await res.json();
        setSubmitError(errorData?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Something went wrong during update');
    } finally {
      // setIsSubmitting(false); // This line was missing, adding it for completeness
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
      const response = await fetch(`${apiUrl}/admin/tours/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `Failed to delete tour with ID: ${id}`
        );
      }
      setTours((prev) => prev.filter((tour) => tour.id !== id));
      setDeleteConfirmationId(null);
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err.message);
      console.error(`Error deleting tour with ID ${id}:`, err);
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
            <CalendarDays className="w-6 h-6 text-[var(--enterprise-blue)]" />
            Manage Tours
          </h1>
          <Link
            href="/admin/add/tour"
            className="inline-flex items-center text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] py-2 px-4 rounded-md shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enterprise-blue)] transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        {loading && <p>Loading tours...</p>}
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
            <span className="block sm:inline">Tour deleted successfully!</span>
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
            <span className="block sm:inline">Tour edited successfully!</span>
          </div>
        )}
        {!loading && tours.length > 0 ? (
          <div className="bg-white shadow-md rounded-md overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Group Size
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Highlights {/* New column header */}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour.id}>
                    {editRowId === tour.id ? (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.id}
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
                            name="duration"
                            value={editFormData.duration}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            type="number"
                            name="groupSize"
                            value={editFormData.groupSize}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            type="number"
                            name="price"
                            value={editFormData.price}
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
                          <Textarea
                            name="highlights"
                            value={editFormData.highlights}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            rows={2} // Adjust rows as needed
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button
                            onClick={handleSaveClick}
                            variant="ghost" // Added variant="ghost"
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelClick}
                            variant="ghost" // Added variant="ghost"
                            className="cursor-pointer text-gray-600 hover:underline"
                          >
                            Cancel
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.id}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.name}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.duration}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.groupSize}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          ${tour.price}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.location}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tour.highlights && tour.highlights.join(', ')}{' '}
                          {/* Display highlights */}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Button
                            onClick={() => handleEditClick(tour)}
                            variant="ghost" // Added variant="ghost"
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </Button>
                          {deleteConfirmationId === tour.id ? (
                            <div className="inline-flex items-center space-x-2">
                              <Button
                                onClick={() => handleDelete(tour.id)}
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
                              onClick={() => confirmDelete(tour.id)}
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
          !loading && <p>No tours found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageToursPage;
