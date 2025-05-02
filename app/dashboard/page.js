'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

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
                  John Doe
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
            onClick={() => router.push('/auth/logout')}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
