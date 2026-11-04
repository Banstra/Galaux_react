'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { fetchAPI } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Предполагаем, что ваш бэкенд принимает это на /auth/login
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }), // Или email, зависит от вашего DTO
      });

      setAuth(data, data.access_token);
      router.push('/'); // Перенаправление на главную страницу
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    // Перенаправляем пользователя на бэкенд, который запустит OAuth поток
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/microsoft`;
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">С возвращением!</h1>
          <p className="py-6">
            Войдите в аккаунт, чтобы управлять своими серверами и общаться с
            сообществом.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error text-sm mb-2">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="fieldset">
              <label className="label">Email или Логин</label>
              <input
                type="email"
                className="input w-full"
                placeholder="Введите логин"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label className="label mt-2">Пароль</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex flex-row justify-between mt-2">
                <a className="link link-hover text-sm">Забыли пароль?</a>
                <a className="link link-hover text-sm" href="/auth/register">
                  Регистрация
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-neutral mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Войти'
                )}
              </button>
            </form>

            <div className="divider">ИЛИ</div>

            <button
              onClick={handleMicrosoftLogin}
              className="btn btn-outline w-full"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 23 23"
                fill="currentColor"
              >
                <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
              </svg>
              Войти через Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
