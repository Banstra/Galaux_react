'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';
import ConfirmModal from '../_components/ConfirmModal';
import UserProfileView, {
  Friend,
  Profile,
  SearchResultUser,
  TabKey,
} from '../_components/UserProfileView';
import { Post } from '@/app/_components/PostCard';


const DEMO_POSTS: Post[] = [
  {
    id: 999,
    content: 'Добро пожаловать в Galaux! Это демо-пост.',
    likes: 42,
    comments: 0,
    liked: false,
    author: { id: 0, username: 'GalauxSystem' },
    created_at: new Date().toISOString(),
  },
];

function EditModal(props: {
  profile?: Profile;
  onClose: () => void;
  onSave: (patch: any) => void;
}) {
  return null;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [profile, setProfile] = useState<Profile>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [tab, setTab] = useState<TabKey>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    type: 'friend' | 'post';
  } | null>(null);
  const [removingFriendId, setRemovingFriendId] = useState<number | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) {
      router.replace('/auth/login');
      return;
    }



    const load = async () => {
      try {
        const profileData = await fetchAPI('/auth/profile');
        setProfile(profileData);

        const postsRes = await fetchAPI('/post?page=1&limit=20');
        const items: Post[] = Array.isArray(postsRes)
          ? postsRes
          : (postsRes.items ?? []);
        const mine = items.filter(
          (p) => !p.author?.id || p.author.id === profileData.id,
        );
        setPosts(mine.length ? mine : DEMO_POSTS);

        const friendsRes = await fetchAPI('/friendship/my-friends');
        setFriends(Array.isArray(friendsRes) ? friendsRes : []);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      }
    };
    load();
  }, [isHydrated, token, router]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await fetchAPI(
          `/user/search?q=${encodeURIComponent(searchQuery)}`,
        );
        setSearchResults(
          Array.isArray(results)
            ? results.filter((u: any) => u.id !== profile?.id)
            : [],
        );
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, profile?.id]);

  async function toggleLike(postId: number) {
    if (likingPosts.has(postId)) return;
    setLikingPosts((p) => new Set(p).add(postId));
    setPosts((ps) =>
      ps.map((x) =>
        x.id === postId
          ? {
              ...x,
              liked: !x.liked,
              likes: (x.likes ?? 0) + (x.liked ? -1 : 1),
            }
          : x,
      ),
    );
    try {
      await fetchAPI(`/post/${postId}/like`, { method: 'POST' });
    } catch {
      setPosts((ps) =>
        ps.map((x) =>
          x.id === postId
            ? {
                ...x,
                liked: !x.liked,
                likes: (x.likes ?? 0) + (x.liked ? 1 : -1),
              }
            : x,
        ),
      );
    } finally {
      setLikingPosts((p) => {
        const n = new Set(p);
        n.delete(postId);
        return n;
      });
    }
  }

  async function executeDelete() {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'friend') {
        await fetchAPI(`/friendship/${confirmDelete.id}`, { method: 'DELETE' });
        setFriends((f) => f.filter((x) => x.id !== confirmDelete.id));
      } else {
        await fetchAPI(`/post/${confirmDelete.id}`, { method: 'DELETE' });
        setPosts((p) => p.filter((x) => x.id !== confirmDelete.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDelete(null);
    }
  }

  async function publish() {
    if (!draft.trim() || publishing) return;
    setPublishing(true);
    try {
      const created = await fetchAPI('/post', {
        method: 'POST',
        body: JSON.stringify({ content: draft }),
      });
      setPosts((ps) => [
        { ...created, likes: 0, comments: 0, liked: false },
        ...ps,
      ]);
      setDraft('');
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  async function addFriend(targetId: number) {
    try {
      await fetchAPI(`/friendship/request/${targetId}`, { method: 'POST' });
      setSearchResults((prev) => prev.filter((u) => u.id !== targetId));
      alert('Заявка в друзья отправлена!');
    } catch (err) {
      console.error('Ошибка отправки заявки:', err);
      alert('Не удалось отправить заявку.');
    }
  }
  if (!isHydrated || !profile) {
    return <div className="min-h-dvh" />;
  }

  return (
    <>
      <UserProfileView
        profile={profile}
        isOwner={true}
        friends={friends}
        posts={posts}
        searchResults={searchResults}
        searchLoading={searchLoading}
        searchQuery={searchQuery}
        draft={draft}
        publishing={publishing}
        removingFriendId={removingFriendId}
        tab={tab}
        onEdit={() => setEditOpen(true)}
        onPublish={publish}
        onDraftChange={setDraft}
        onTabChange={setTab}
        onSearchChange={setSearchQuery}
        onLike={toggleLike}
        onDeletePost={(id) => setConfirmDelete({ id, type: 'post' })}
        onRemoveFriend={(id) => {
          setRemovingFriendId(id);
          setConfirmDelete({ id, type: 'friend' });
        }}
      />

      {editOpen && (
        <EditModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={(patch: any) =>
            setProfile((p: any) => (p ? { ...p, ...patch } : p))
          }
        />
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        title={
          confirmDelete?.type === 'friend'
            ? 'Удалить из друзей?'
            : 'Удалить пост?'
        }
        message={
          confirmDelete?.type === 'friend'
            ? 'Пользователь будет удалён из вашего списка друзей.'
            : 'Пост будет безвозвратно удалён из ленты.'
        }
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Удалить"
      />
    </>
  );
}
