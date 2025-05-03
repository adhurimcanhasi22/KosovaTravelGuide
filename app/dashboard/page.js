'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(''); // Example state for user data

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found, redirecting to login...');
      router.push('/auth/login');
    } else {
      // Optional: Decode token to get user info (if needed immediately)
      // Or make an API call to a protected route to verify token and get user data
      // For now, just assume token presence means authenticated
      console.log('Token found, loading dashboard.');

      // Example: Fetch user data from a protected route
      /*
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user/profile', { // Replace with your actual endpoint
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data or token invalid');
          }
          const userData = await response.json();
          setUserName(userData.name);
          setIsLoading(false);
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('token'); // Clear invalid token
          router.push('/auth/login');
        }
      };
      fetchUserData();
      */

      // If not fetching data, just finish loading
      setIsLoading(false);
    }
  }, [router]); // Add router to dependency array

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Logged out, redirecting to login...');
    router.push('/auth/login');
  };

  if (isLoading) {
    // Optional: Show a loading spinner or skeleton screen
    return <div>Loading dashboard...</div>;
  }

  // Render dashboard content only if loading is finished and user is authenticated (token was present)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--enterprise-blue)]">
            Welcome to Your Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--enterprise-lightgray)]">
            Here you can view your account details and manage your preferences.
          </p>
        </div>

        {/* User Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-[var(--enterprise-black)]">
              Account Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-[var(--enterprise-lightgray)]">
              Details of your account.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--enterprise-lightgray)]">
                  Full Name
                </dt>
                <dd className="mt-1 text-sm text-[var(--enterprise-black)] sm:mt-0 sm:col-span-2">
                  {userName}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--enterprise-lightgray)]">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm text-[var(--enterprise-black)] sm:mt-0 sm:col-span-2">
                  john.doe@example.com
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-[var(--enterprise-lightgray)]">
                  Account Status
                </dt>
                <dd className="mt-1 text-sm text-[var(--enterprise-black)] sm:mt-0 sm:col-span-2">
                  Verified
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 rounded-md text-white bg-[var(--enterprise-blue)] hover:bg-[var(--enterprise-black)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--enterprise-blue)] focus:ring-offset-2">
            Update Profile
          </button>
          <button
            className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
