'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Send,
  Share2,
  ImageOff,
  Loader2,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

type Post = {
  id: number;
  content: string;
  image_url?: string | null;
  likes: number;
  comments: number;
  liked: boolean;
  author: { id: number; username: string; displayName?: string | null };
  created_at: string;
};

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
    // Оптимистичное обновление
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    );

    try {
      await fetchAPI(`/post/${postId}/like`, { method: 'POST' });
    } catch {
      // Откат при ошибке
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? 1 : -1) }
            : p,
        ),
      );
    }
  }

  if (!isMounted || !token) return null;

  return (
    <main className="relative min-h-dvh pb-20">

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
              <article
                key={post.id}
                className="glass card-hover rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Link
                    href={`/profile/${post.author.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-grape/40 to-neon/40 flex items-center justify-center font-display text-white text-lg group-hover:scale-105 transition-transform">
                      {(post.author.displayName ||
                        post.author.username)[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 group-hover:text-neon transition-colors">
                        {post.author.displayName || post.author.username}
                      </div>
                      <div className="text-xs text-slate-500">
                        @{post.author.username} • {timeAgo(post.created_at)}
                      </div>
                    </div>
                  </Link>
                </div>

                <p className="text-slate-200 whitespace-pre-wrap mb-4 leading-relaxed">
                  {post.content}
                </p>

                {post.image_url ? (
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
                    <img
                      src={post.image_url}
                      alt=""
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                ) : (
                  <div className="h-32 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-slate-600 mb-4 bg-white/[0.02]">
                    <ImageOff size={24} className="mr-2" /> Нет медиа
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-sm text-slate-400">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 transition ${post.liked ? 'text-coral' : 'hover:text-coral'}`}
                  >
                    <Heart
                      size={18}
                      fill={post.liked ? 'currentColor' : 'none'}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 hover:text-ice transition">
                    <MessageCircle size={18} />
                    <span>{post.comments}</span>
                  </button>

                  <button className="ml-auto hover:text-neon transition">
                    <Share2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
