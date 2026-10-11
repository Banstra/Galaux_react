'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore'; // Adjust this path to wherever your store is

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Grab the token from the URL (e.g., ?token=xyz123)
    const token = searchParams.get('token');

    if (token) {
      // Save the token to Zustand (which automatically saves it to localStorage)
      useAuthStore.setState({ token });

      // Redirect to the home page
      router.push('/');
    } else {
      // If there's no token, something went wrong during login
      router.push('/?error=login_failed');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <p className="text-xl">Logging you in...</p>
    </div>
  );
}
