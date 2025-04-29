'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Send a POST request to the logout endpoint
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`);

      // Redirect to the login page after logout
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Log Out
    </button>
  );
}
