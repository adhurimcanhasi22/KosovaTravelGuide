'use client';
import axios from 'axios';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/requestPasswordReset`,
        {
          email: formData.email,
          redirectUrl: 'https://kosovatravelguide.netlify.app/reset-password/',
        },
        {
          withCredentials: true, // <-- important if backend uses cookies
        }
      );

      setSuccessMessage('A password reset link has been sent to your email.');
    } catch (error) {
      // Handle error responses from the backend
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Reset your password for Kosovo Travel Guide. Enter your email to receive a password reset link."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--enterprise-gray)] pt-10">
              Forgot Your Password?
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--enterprise-lightgray)]">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-kosovo-blue focus:border-kosovo-blue focus:z-10 sm:text-sm ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full py-2 px-4 rounded-md text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--enterprise-blue)] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link href="/auth/login">
              <i className="fas fa-arrow-left mr-1 text-[var(--enterprise-yellow)] hover:text-[var(--enterprise-lightyellow)]"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
