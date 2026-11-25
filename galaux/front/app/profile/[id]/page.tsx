'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  Globe,
  ShieldCheck,
  Loader2,
  UserPlus,
  MessageCircle,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

type UserProfile = {
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
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<
    'none' | 'pending' | 'friends'
  >('none');

  // 1. Гидратация
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 2. Загрузка данных профиля и проверка дружбы
  useEffect(() => {
    if (!isHydrated) return;

    // Если пользователь смотрит свой профиль, редиректим на главную страницу профиля
    if (currentUser && currentUser.id === id) {
      router.replace('/profile');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Загружаем профиль пользователя
        const userData = await fetchAPI(`/user/${id}`);
        setProfile(userData);

        // Проверяем, есть ли пользователь уже в списке друзей
        try {
          const friendsData = await fetchAPI('/friendship/my-friends');
          const isFriend =
            Array.isArray(friendsData) &&
            friendsData.some((f: any) => f.id === id);
          if (isFriend) {
            setFriendStatus('friends');
          }
        } catch {
          // Если не удалось получить список друзей, считаем, что не друзья
          setFriendStatus('none');
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentUser, isHydrated, router]);

  // 3. Отправка заявки в друзья
  async function sendFriendRequest() {
    try {
      await fetchAPI(`/friendship/request/${id}`, { method: 'POST' });
      setFriendStatus('pending');
      alert('Заявка в друзья отправлена!');
    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      alert('Не удалось отправить заявку. Возможно, вы уже отправили её.');
    }
  }

  // 4. Состояния загрузки и ошибки
  if (!isHydrated || loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-void">
        <Loader2 size={40} className="text-neon animate-spin" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center text-slate-400 gap-4 bg-void">
        <ShieldCheck size={48} className="text-slate-600" />
        <p>Пользователь не найден или скрыл свой профиль.</p>
      </main>
    );
  }

  const displayName = profile.displayName || profile.username;

  // 5. Рендер публичного профиля
  return (
    <div className="relative min-h-dvh bg-void">

      {/* Обложка */}
      <section className="relative h-48 md:h-64 bg-linear-to-r from-deep via-abyss to-void border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-linear-to-t from-void to-transparent" />
      </section>

      {/* Контент профиля */}
      <section className="mx-auto max-w-4xl px-6 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-end gap-6">
          {/* Аватар */}
          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-2xl border-4 border-void bg-linear-to-br from-grape/60 to-neon/40 flex items-center justify-center font-display text-5xl text-white shadow-[0_0_40px_rgba(139,92,246,.4)]">
              {displayName[0]?.toUpperCase()}
            </div>
            <div
              className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-void ${profile.offline === false ? 'bg-emerald-400' : 'bg-slate-600'}`}
              title={profile.offline === false ? 'Онлайн' : 'Оффлайн'}
            />
          </div>

          {/* Инфо */}
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

          {/* Кнопки действий (только для чужих профилей) */}
          <div className="flex gap-3 pb-4">
            {friendStatus === 'none' && (
              <button
                onClick={sendFriendRequest}
                className="btn-neon !px-6 !py-3"
              >
                <UserPlus size={18} /> Добавить в друзья
              </button>
            )}
            {friendStatus === 'pending' && (
              <button
                disabled
                className="btn-ghost !px-6 !py-3 opacity-50 cursor-not-allowed"
              >
                Заявка отправлена
              </button>
            )}
            {friendStatus === 'friends' && (
              <button className="btn-ghost !px-6 !py-3 border-emerald-500/30 text-emerald-400">
                <Users size={18} /> В друзьях
              </button>
            )}
            <button
              className="btn-ghost !px-4 !py-3"
              title="Написать сообщение"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>

        {/* Статистика (заглушка, пока нет отдельного эндпоинта статистики) */}
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

        {/* Лента постов пользователя (заглушка) */}
        <div className="py-10 text-center text-slate-500 glass rounded-2xl mt-8 p-12">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p>Пользователь пока не опубликовал никаких постов.</p>
          <p className="text-xs mt-2">
            (Здесь будет интеграция с GET /post?authorId={id})
          </p>
        </div>
      </section>
    </div>
  );
}
