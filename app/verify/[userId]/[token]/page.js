'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail({ params }) {
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify/${params.userId}/${params.token}`
        );
        router.push('/verified-success');
      } catch (error) {
        router.push('/verified-error');
      }
    };

    verifyEmail();
  }, []);

  return <div>Verifying email...</div>;
}
