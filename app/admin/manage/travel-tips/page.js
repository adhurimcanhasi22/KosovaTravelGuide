'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb, AlertCircle, CheckCircle, Plus } from 'lucide-react'; // Changed Hotel to Lightbulb, added Plus
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ManageTravelTipsPage = () => {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [travelTips, setTravelTips] = useState([]); // Changed from accommodations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({
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
          router.push('/dashboard');
        } else {
          fetchTravelTips(token); // Changed function call
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

  const fetchTravelTips = async (token) => {
    // Changed function name
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL is not defined in your environment.'
        );
      }
      const response = await fetch(`${apiUrl}/admin/traveltips`, {
        // Changed API endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to fetch travel tips'); // Changed message
      }
      const data = await response.json();
      setTravelTips(data.data || []); // Changed state update
      console.log('Travel tips state updated:', data); // Changed log message
    } catch (err) {
      setError(err.message);
      console.error('Error fetching travel tips:', err); // Changed log message
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (travelTip) => {
    // Changed parameter name
    setEditRowId(travelTip.id);
    setEditFormData({
      id: travelTip.id,
      title: travelTip.title,
      icon: travelTip.icon,
      content: travelTip.content,
      list: travelTip.list ? travelTip.list.join(', ') : '', // Convert array to comma-separated string
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
      const res = await fetch(`${apiUrl}/admin/traveltips/${editRowId}`, {
        // Changed API endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editFormData.id,
          title: editFormData.title,
          icon: editFormData.icon,
          content: editFormData.content,
          list: editFormData.list // Convert comma-separated string to array for backend
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTravelTips(
          (
            prev // Changed state update
          ) => prev.map((t) => (t.id === editRowId ? data.data : t))
        );
        setEditRowId(null);
        setSubmitSuccess(true);
      } else {
        setSubmitError(data.message || 'Failed to update travel tip'); // Changed message
      }
    } catch (err) {
      console.error('Error saving travel tip:', err); // Changed log message
      setSubmitError(
        err.message || 'Something went wrong while saving travel tip'
      ); // Changed message
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
      const response = await fetch(`${apiUrl}/admin/traveltips/${id}`, {
        // Changed API endpoint
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `Failed to delete travel tip with ID: ${id}` // Changed message
        );
      }
      setTravelTips((prev) => prev.filter((tip) => tip.id !== id)); // Changed state update
      setDeleteConfirmationId(null);
      setDeleteSuccess(true);
    } catch (err) {
      setDeleteError(err.message);
      console.error(`Error deleting travel tip with ID ${id}:`, err); // Changed log message
    } finally {
      setIsDeleting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mt-[6.5rem] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-6 h-6" /> {/* Changed icon */}
            Manage Travel Tips
          </h1>
          <Link
            href="/admin/add/travel-tip"
            className="inline-flex items-center text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] py-2 px-4 rounded-md shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--enterprise-blue)] transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        {loading && <p>Loading travel tips...</p>} {/* Changed message */}
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
              Travel tip deleted successfully! {/* Changed message */}
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
              Travel tip edited successfully! {/* Changed message */}
            </span>
          </div>
        )}
        {!loading && travelTips.length > 0 ? (
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
                    Title {/* Changed header */}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Icon {/* Changed header */}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Content {/* Changed header */}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    List Items {/* Changed header */}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {travelTips.map((tip) => (
                  <tr key={tip.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {tip._id}
                    </td>

                    {editRowId === tip.id ? (
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
                            name="title"
                            value={editFormData.title}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Input
                            name="icon"
                            value={editFormData.icon}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Textarea
                            name="content"
                            value={editFormData.content}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            rows={2}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Textarea
                            name="list"
                            value={editFormData.list}
                            onChange={handleInputChange}
                            className="border px-2 py-1 w-full"
                            rows={2}
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
                          {tip.id}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tip.title}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tip.icon}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tip.content}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {tip.list.join(', ')}{' '}
                          {/* Display list as comma-separated */}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={() => handleEditClick(tip)}
                            className="cursor-pointer text-blue-600 hover:underline mr-2"
                          >
                            Edit
                          </button>
                          {deleteConfirmationId === tip.id ? (
                            <div className="inline-flex items-center space-x-2">
                              <Button
                                onClick={() => handleDelete(tip.id)}
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
                              onClick={() => confirmDelete(tip.id)}
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
          !loading && <p>No travel tips found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageTravelTipsPage;
