// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Получаем данные пользователя с бэкенда, используя новый токен
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then((user) => {
          setAuth(user, token);
          router.push('/'); // Успешный вход, редирект на главную
        })
        .catch((err) => {
          console.error('Auth callback failed', err);
          router.push('/auth/login?error=auth_failed');
        });
    } else {
      router.push('/auth/login?error=no_token');
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-medium">
          Завершаем вход через Microsoft...
        </p>
      </div>
    </div>
  );
}
