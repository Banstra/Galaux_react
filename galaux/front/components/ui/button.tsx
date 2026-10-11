'use client';

import {useAuthStore} from '@/app/store/authStore';

export function LoginButton() {
  const { token, logout } = useAuthStore();

  if (token) {
    return (
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    );
  }

  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/microsoft';
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Login with Microsoft
    </button>
  );
}
