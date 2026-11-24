'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6)
      return setError('Пароль должен быть не короче 6 символов');
    if (form.password !== form.confirm) return setError('Пароли не совпадают');
    if (!agree) return setError('Необходимо принять правила проекта');

    setLoading(true);
    try {
      // Бэкенд регистрирует через POST /user (CreateUserDto: username, email, password)
      await fetchAPI('/user', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      router.push('/auth/login?message=registered');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-96 animate-pulse-glow rounded-full bg-neon/15 blur-3xl" />

      <div className="glass w-full max-w-md rounded-2xl p-8">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-grape/40 font-display text-grape">
          G
        </div>
        <h1 className="text-center font-display text-2xl tracking-wider text-white">
          Регистрация
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Создайте аккаунт Galaux — бесплатно
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-coral/40 bg-coral/10 px-4 py-2 text-sm text-coral">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Имя пользователя</label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                className="field !pl-9"
                placeholder="Player_Name"
                value={form.username}
                onChange={set('username')}
                required
                minLength={3}
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                className="field !pl-9"
                placeholder="example@mail.com"
                value={form.email}
                onChange={set('email')}
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
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
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
          <div>
            <label className="label">Повторите пароль</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={show ? 'text' : 'password'}
                className="field !pl-9"
                placeholder="••••••••"
                value={form.confirm}
                onChange={set('confirm')}
                required
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#8b5cf6]"
            />
            <span>
              Я принимаю{' '}
              <Link href="/rules" className="text-ice hover:text-neon">
                правила проекта
              </Link>
            </span>
          </label>
          <button type="submit" disabled={loading} className="btn-neon w-full">
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Уже есть аккаунт?{' '}
          <Link
            href="/auth/login"
            className="text-ice underline-offset-4 hover:text-neon hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
