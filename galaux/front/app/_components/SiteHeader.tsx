'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { fetchAPI } from '@/lib/api';

const NAV = [
  { label: 'Поддержка', href: '/#support' },
  { label: 'Лаунчер', href: '/#launcher' },
  { label: 'Цены', href: '/pricing' },
];

export default function SiteHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  async function signOut() {
    try {
      await fetchAPI('/auth/logout', { method: 'POST' });
    } catch {}
    logout();
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-x-0 border-t-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-2xl tracking-wider text-ice"
          >
            GALAUX
          </Link>

          <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="transition hover:text-neon"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="btn-neon !px-4 !py-2 text-sm">
                Профиль
              </Link>
              <button
                onClick={signOut}
                className="btn-ghost !px-4 !py-2 text-sm"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="btn-ghost !px-4 !py-2 text-sm"
              >
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="btn-neon !px-4 !py-2 text-sm"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
