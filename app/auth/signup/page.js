'use client';
import axios from 'axios';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password =
        'Password must be at least 8 characters and contain at least one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Similar structure to login page, with:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/signup`,
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.status === 'PENDING') {
        router.push('/auth/verify-email');
      } else {
        setSignupError(
          response.data.message || 'Signup failed. Please try again.'
        );
      }
    } catch (error) {
      setSignupError(
        error.response?.data?.message || 'Signup failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  return (
    <>
      <Head>
        <title>Create an Account | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Sign up for a Kosovo Travel Guide account to save your favorite destinations, get personalized recommendations, and manage your travel plans."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--enterprise-gray)] pt-10">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--enterprise-lightgray)]">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-400"
              >
                Login
              </Link>
            </p>
          </div>

          {signupError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{signupError}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--enterprise-blue)] focus:border-[var(--enterprise-blue)] focus:z-10 sm:text-sm ${
                    errors.fullName ? 'border-red-500' : ''
                  }`}
                  placeholder="Full Name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--enterprise-blue)] focus:border-[var(--enterprise-blue)] focus:z-10 sm:text-sm ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--enterprise-blue)] focus:border-[var(--enterprise-blue)] focus:z-10 sm:text-sm ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-gray-500 hover:text-[var(--enterprise-blue)] focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.125 2.88-.357a3.5 3.5 0 00-2.88-3.448h.002zM12 15a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--enterprise-blue)] focus:border-[var(--enterprise-blue)] focus:z-10 sm:text-sm ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-gray-500 hover:text-[var(--enterprise-blue)] focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.125 2.88-.357a3.5 3.5 0 00-2.88-3.448h.002zM12 15a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={`h-4 w-4 text-[var(--enterprise-blue)] focus:ring-[var(--enterprise-blue)] border-gray-300 rounded ${
                  errors.agreeTerms ? 'border-red-500' : ''
                }`}
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-[var(--enterprise-lightgray)]"
              >
                I agree to the{' '}
                <a
                  href="#"
                  className="text-[var(--enterprise-blue)] hover:text-[var(--enterprise-skyblue)]"
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-[var(--enterprise-blue)] hover:text-[var(--enterprise-skyblue)]"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded-md text-white bg-[var(--enterprise-lightblue)] hover:bg-[var(--enterprise-skyblue)] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--enterprise-blue)] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link href="/">
              {' '}
              <i className="fas fa-arrow-left mr-1 text-[var(--enterprise-yellow)] hover:text-[var(--enterprise-lightyellow)]"></i>{' '}
            </Link>

            <Link
              href="/"
              className="mr-4 font-medium text-lg text-[var(--enterprise-blue)] hover:text-[var(--enterprise-skyblue)] transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
