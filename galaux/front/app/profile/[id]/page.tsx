'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

type Profile = {
  id: number;
  username: string;
  displayName?: string | null;
  profile_info?: string | null;
  telegram_link?: string | null;
  discord_link?: string | null;
  offline?: boolean;
  role?: { name?: string } | null;
};

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const currentUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Безопасная гидратация
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 2. Загрузка данных только ПОСЛЕ гидратации
  useEffect(() => {
    if (!isHydrated) return; // Ждем, пока Zustand прочитает localStorage

    if (!token) {
      router.replace('/auth/login');
      return;
    }

    // Если пользователь смотрит свой профиль, редиректим на главную страницу профиля
    if (currentUser && currentUser.id === id) {
      router.replace('/profile');
      return;
    }

    setLoading(true);
    fetchAPI(`/user/${id}`)
      .then((userData) => {
        setProfile(userData);
      })
      .catch(() => {
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, currentUser, token, isHydrated, router]);

  // 3. Показываем лоадер, пока не поняли, авторизован ли пользователь
  if (!isHydrated || loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <Loader2 size={40} className="text-neon animate-spin" />
      </main>
    );
  }

  // 4. Если эндпоинт вернул 404 или пользователь не найден
  if (!profile) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center text-slate-400 gap-4">
        <ShieldCheck size={48} className="text-slate-600" />
        <p>Пользователь не найден или скрыл свой профиль.</p>
      </main>
    );
  }

  const displayName = profile.displayName || profile.username;

  return (
    <main className="relative min-h-dvh">
      {/* Обложка */}
      <section className="relative h-48 md:h-64 bg-gradient-to-r from-deep via-abyss to-void border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent" />
      </section>

      {/* Контент профиля */}
      <section className="mx-auto max-w-4xl px-6 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-end gap-6">
          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-2xl border-4 border-void bg-gradient-to-br from-grape/60 to-neon/40 flex items-center justify-center font-display text-5xl text-white shadow-[0_0_40px_rgba(139,92,246,.4)]">
              {displayName[0]?.toUpperCase()}
            </div>
            <div
              className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-void ${profile.offline === false ? 'bg-emerald-400' : 'bg-slate-600'}`}
              title={profile.offline === false ? 'Онлайн' : 'Оффлайн'}
            />
          </div>

          <div className="flex-1 pb-2">
            <h1 className="font-display text-4xl text-white tracking-wide">
              {displayName}
            </h1>
            <p className="text-slate-400 mt-1">@{profile.username}</p>

            {profile.profile_info && (
              <p className="mt-4 text-slate-300 max-w-lg leading-relaxed">
                {profile.profile_info}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {profile.role?.name && (
                <span className="chip border-grape/30 text-grape bg-grape/10">
                  {profile.role.name}
                </span>
              )}
              {profile.telegram_link && (
                <a
                  href={profile.telegram_link}
                  target="_blank"
                  rel="noreferrer"
                  className="chip hover:bg-neon/20 hover:text-neon transition"
                >
                  <Globe size={12} /> Telegram
                </a>
              )}
              {profile.discord_link && (
                <a
                  href={profile.discord_link}
                  target="_blank"
                  rel="noreferrer"
                  className="chip hover:bg-neon/20 hover:text-neon transition"
                >
                  <Globe size={12} /> Discord
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Статистика (заглушка, пока нет эндпоинта статистики) */}
        <div className="mt-8 flex gap-8 border-b border-white/10 pb-6 text-sm text-slate-400">
          <span>
            <b className="text-ice text-lg">0</b> подписчиков
          </span>
          <span>
            <b className="text-ice text-lg">0</b> друзей
          </span>
          <span>
            <b className="text-ice text-lg">0</b> постов
          </span>
        </div>

        {/* Пустая лента постов пользователя */}
        <div className="py-10 text-center text-slate-500 glass rounded-2xl mt-8 p-12">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p>Пользователь пока не опубликовал никаких постов.</p>
        </div>
      </section>
    </main>
  );
}
