'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserPlus, Users, MessageCircle, Globe, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../_components/SiteHeader';
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
  money?: number;
};

type FriendshipStatus = 'none' | 'pending' | 'friends' | 'incoming';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const currentUser = useAuthStore((s) => s.user);
  const [isMounted, setIsMounted] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    if (!currentUser?.id || isNaN(id)) return;

    // Если смотрим свой профиль - редиректим на /profile
    if (currentUser.id === id) {
      router.replace('/profile');
      return;
    }

    Promise.all([
      fetchAPI(`/user/${id}`).catch(() => null), // TODO: добавить эндпоинт GET /user/:id
      // fetchAPI(`/friendship/status/${id}`).catch(() => 'none') // TODO: добавить проверку статуса
    ]).then(([userData]) => {
      setProfile(userData);
      setLoading(false);
    });
  }, [id, currentUser, router]);

  async function sendFriendRequest() {
    try {
      await fetchAPI('/friendship/request', {
        method: 'POST',
        body: JSON.stringify({ addressee_id: id }),
      });
      setFriendshipStatus('pending');
    } catch (err) {
      console.error(err);
    }
  }
  async function removeFriend() {
    if (
      !confirm('Вы уверены, что хотите удалить этого пользователя из друзей?')
    )
      return;

    try {
      await fetchAPI(`/friendship/${id}`, { method: 'DELETE' }); // Уточните эндпоинт у коллеги
      setFriendshipStatus('none');
    } catch (err) {
      console.error('Ошибка при удалении друга:', err);
    }
  }

  if (!isMounted || !currentUser) return null;

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="animate-spin text-neon"><ShieldCheck size={40} /></div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-dvh flex items-center justify-center text-slate-400">
        Пользователь не найден или скрыл свой профиль.
      </main>
    );
  }

  const displayName = profile.displayName || profile.username;
  const isMe = currentUser.id === profile.id;

  return (
    <main className="relative min-h-dvh">
      <SiteHeader />

      {/* Обложка */}
      <section className="relative h-48 md:h-64 bg-gradient-to-r from-deep via-abyss to-void border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent" />
      </section>

      <section className="mx-auto max-w-4xl px-6 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-end gap-6">
          {/* Аватар */}
          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-2xl border-4 border-void bg-gradient-to-br from-grape/60 to-neon/40 flex items-center justify-center font-display text-5xl text-white shadow-[0_0_40px_rgba(139,92,246,.4)]">
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

          {/* Действия (только для чужих профилей) */}
          {!isMe && (
            <div className="flex gap-3 pb-4">
              {friendshipStatus === 'friends' ? (
                <>
                  <button
                    onClick={removeFriend}
                    className="btn-ghost !px-6 !py-3 border-coral/30 text-coral hover:bg-coral/10"
                  >
                    Удалить из друзей
                  </button>
                  <button className="btn-ghost !px-4 !py-3">
                    <MessageCircle size={18} />
                  </button>
                </>
              ) : friendshipStatus === 'pending' ? (
                <button
                  disabled
                  className="btn-ghost !px-6 !py-3 opacity-50 cursor-not-allowed"
                >
                  Заявка отправлена
                </button>
              ) : (
                <button
                  onClick={sendFriendRequest}
                  className="btn-neon !px-6 !py-3"
                >
                  <UserPlus size={18} /> Добавить в друзья
                </button>
              )}
            </div>
          )}
        </div>

        {/* Статистика */}
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

        {/* Контент профиля (заглушка) */}
        <div className="py-10 text-center text-slate-500 glass rounded-2xl mt-8 p-12">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p>Пользователь пока не опубликовал никаких постов.</p>
        </div>
      </section>
    </main>
  );
}