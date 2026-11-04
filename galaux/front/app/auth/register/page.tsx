'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { fetchAPI } from '@/lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
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
      // Убедитесь, что этот путь совпадает с вашим контроллером на бэкенде (например, /users или /auth/register)
      const data = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      // Если бэкенд возвращает токен сразу при регистрации:
      if (data.token || data.access_token) {
        setAuth(data.newUser || data, data.token || data.access_token);
        router.push('/');
      } else {
        router.push('/auth/login?message=registration_success');
      }
    } catch (err) {
      setError( 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Создать аккаунт</h1>
          <p className="py-6">
            Присоединяйтесь к нашему сообществу Minecraft-проектов.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error text-sm mb-2">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="fieldset">
              <label className="label">Имя пользователя</label>
              <input
                type="name"
                className="input w-full"
                placeholder="Ваш никнейм"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label className="label mt-2">Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label className="label mt-2">Пароль</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              <div className="flex flex-row justify-between mt-2">
                <a className="link link-hover text-sm" href="/auth/login">
                  Уже есть аккаунт? Войти
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
                  'Зарегистрироваться'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
