'use client';

import { useEffect, useState } from 'react';
import {
  Send,
  Loader2,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';
import PostCard, { Post } from '@/app/_components/PostCard';
import { Friend } from '@/app/profile/page';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return 'только что';
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    type: 'friend' | 'post';
  } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [likingPosts, setLikingPosts] = useState<Set<number>>(new Set());

  // Защита от гидратации
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token || !isMounted) return;

    // Загружаем ленту
    fetchAPI('/post?page=1&limit=20')
      .then((res) => {
        const items = Array.isArray(res) ? res : (res.items ?? []);
        setPosts(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, isMounted]);

  async function publishPost() {
    if (!draft.trim() || publishing) return;
    setPublishing(true);
    try {
      const newPost = await fetchAPI('/post', {
        method: 'POST',
        body: JSON.stringify({ content: draft }),
      });
      // Добавляем новый пост в начало ленты
      setPosts((prev) => [{ ...newPost, liked: false }, ...prev]);
      setDraft('');
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }

  async function toggleLike(postId: number) {
    if (likingPosts.has(postId)) return; // Игнорируем повторные клики

    setLikingPosts((prev) => new Set(prev).add(postId));

    // Оптимистичное обновление
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
      // Откат при ошибке сети
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
      setLikingPosts((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }


  if (!isMounted || !token) return null;

  async function executeDelete() {
    if (!confirmDelete) return;

    try {
      if (confirmDelete.type === 'friend') {
        await fetchAPI(`/friendship/${confirmDelete.id}`, { method: 'DELETE' });
        setFriends((prev) => prev.filter((f) => f.id !== confirmDelete.id));
      } else if (confirmDelete.type === 'post') {
        await fetchAPI(`/post/${confirmDelete.id}`, { method: 'DELETE' });
        setPosts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    } finally {
      setConfirmDelete(null);
    }
  }

  return (
    <div className="relative min-h-dvh pb-20">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        {/* Композер */}
        <div className="glass rounded-2xl p-5 mb-8">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Что нового в галактике?"
            rows={3}
            className="field resize-none bg-transparent border-0 focus:ring-0"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-xs text-slate-500">{draft.length}/2000</span>
            <button
              onClick={publishPost}
              disabled={!draft.trim() || publishing}
              className="btn-neon !px-5 !py-2 text-sm disabled:opacity-50"
            >
              {publishing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Опубликовать
                </>
              )}
            </button>
          </div>
        </div>

        {/* Список постов */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-neon animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-slate-400">
            Лента пуста. Станьте первым, кто опубликует новость!
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onLike={toggleLike}
                isLiking={likingPosts.has(post.id)} // <-- Добавьте эту строку
                onDelete={(postId) =>
                  setConfirmDelete({ id: postId, type: 'post' })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
