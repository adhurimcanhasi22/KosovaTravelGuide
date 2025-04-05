"use client"; // Mark this file as a Client Component

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset any previous login errors
    setLoginError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to login (will be replaced with actual API integration)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This is a frontend-only demo without actual authentication
      // In a real app, this would verify credentials with a backend API

      console.log("Login attempt with:", formData.email);

      // Simulate successful login
      localStorage.setItem("isLoggedIn", "true");

      // Redirect after successful login
      router.push("/");
    } catch (error) {
      setLoginError(
        "Login failed. Please check your credentials and try again."
      );
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Log in to your Kosovo Travel Guide account for personalized travel recommendations, saved itineraries, and booking management."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--enterprise-gray)] pt-10">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--enterprise-lightgray)]">
              Or{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-400"
              >
                create a new account
              </Link>
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{loginError}</p>
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
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-kosovo-blue focus:border-kosovo-blue focus:z-10 sm:text-sm ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-kosovo-blue focus:ring-kosovo-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[var(--enterprise-lightgray)]"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[var-(--enterprise-blue)] hover:text-[var-(--enterprise-blue)]"
                >
                  Forgot your password?
                </a>
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mt-3">
                This is a demo login page. No actual authentication is
                implemented yet.
              </p>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link href="/">
              {" "}
              <i className="fas fa-arrow-left mr-1 text-[var(--enterprise-yellow)] hover:text-[var(--enterprise-lightyellow)]"></i>{" "}
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
