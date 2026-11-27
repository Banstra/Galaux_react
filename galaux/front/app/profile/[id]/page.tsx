'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';
import UserProfileView, {
  Profile,
  FriendStatus,
} from '@/app/_components/UserProfileView';
import {Post} from '@/app/_components/PostCard';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const currentUser = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;
    if (currentUser && currentUser.id === id) {
      router.replace('/profile');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const userData = await fetchAPI(`/user/${id}`);
        setProfile(userData);

        try {
          const friendsData = await fetchAPI('/friendship/my-friends');
          const isFriend =
            Array.isArray(friendsData) &&
            friendsData.some((f: any) => f.id === id);
          setFriendStatus(isFriend ? 'friends' : 'none');
        } catch {
          setFriendStatus('none');
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, currentUser, isHydrated, router]);

  async function sendFriendRequest() {
    try {
      await fetchAPI(`/friendship/request/${id}`, { method: 'POST' });
      setFriendStatus('pending');
      alert('Заявка отправлена!');
    } catch (err) {
      console.error(err);
      alert('Не удалось отправить заявку.');
    }
  }

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

  return (
    <main className="relative min-h-dvh bg-void">
      <UserProfileView
        profile={profile}
        isOwner={false}
        friendStatus={friendStatus}
        posts={[]}
        onAddFriend={sendFriendRequest}
      />
    </main>
  );
}
