'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const notice =
    params.get('message') === 'registered'
      ? 'Аккаунт создан. Войдите, чтобы продолжить.'
      : params.get('message') === 'logged_out'
        ? 'Вы вышли из аккаунта.'
        : '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setAuth(data, data.access_token, remember);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass w-full max-w-md rounded-2xl p-8">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-neon/40 font-display text-neon">
        G
      </div>
      <h1 className="text-center font-display text-2xl tracking-wider text-white">
        Авторизация
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Войдите в свой аккаунт Galaux
      </p>

      {notice && (
        <div className="mt-4 rounded-xl border border-neon/30 bg-neon/10 px-4 py-2 text-sm text-ice">
          {notice}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-xl border border-coral/40 bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">Имя пользователя или Email</label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className="field !pl-9"
              placeholder="Player_Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="label">Пароль</label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type={show ? 'text' : 'password'}
              className="field !pl-9 !pr-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-ice"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#06b6d4]"
            />
            Запомнить меня
          </label>
          <a
            href="/auth/forgot"
            className="text-ice/70 transition hover:text-neon"
          >
            Забыли пароль?
          </a>
        </div>
        <button type="submit" disabled={loading} className="btn-neon w-full">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Войти'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-600">
        <span className="h-px flex-1 bg-white/10" /> ИЛИ{' '}
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <button
        onClick={() => (window.location.href = `${API}/auth/microsoft`)}
        className="btn-ghost w-full"
      >
        <svg className="h-4 w-4" viewBox="0 0 23 23" fill="currentColor">
          <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
        </svg>
        Войти через Microsoft
      </button>

      <p className="mt-6 text-center text-sm text-slate-400">
        Нет аккаунта?{' '}
        <Link
          href="/auth/register"
          className="text-ice underline-offset-4 hover:text-neon hover:underline"
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 animate-pulse-glow rounded-full bg-grape/20 blur-3xl" />
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="absolute bottom-6 text-xs text-slate-600">
        © 2026 Galaux. Запусти. Играй. Создавай.
      </p>
    </main>
  );
}
