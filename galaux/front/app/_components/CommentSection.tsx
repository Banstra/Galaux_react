'use client';

import { useState, useEffect } from 'react';
import { Send, Trash2, Loader2, MessageCircle } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

type Comment = {
  id: number;
  content: string;
  author: { id: number; username: string };
  created_at: string;
};

export default function CommentSection({
  postId,
  initialCount = 0,
}: {
  postId: number;
  initialCount?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = useAuthStore((s) => s.user);

  // Загружаем комментарии только при открытии секции
  useEffect(() => {
    if (isOpen && comments.length === 0) {
      setLoading(true);
      fetchAPI(`/comment/post/${postId}`)
        .then((data) => {
          // Бэкенд может вернуть массив или объект { data: [...] }
          const list = Array.isArray(data) ? data : data.data || [];
          setComments(list);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId, comments.length]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const created = await fetchAPI(`/comment/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment }),
      });

      setComments((prev) => [created, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Ошибка отправки комментария:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm('Удалить этот комментарий?')) return;
    try {
      await fetchAPI(`/comment/${commentId}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'только что';
    if (m < 60) return `${m} мин назад`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ч назад`;
    return `${Math.floor(h / 24)} дн назад`;
  }

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      {/* Кнопка переключения */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-neon transition-colors mb-4"
      >
        <MessageCircle size={16} />
        <span>
          {isOpen ? 'Скрыть комментарии' : `Комментарии (${initialCount})`}
        </span>
      </button>

      {/* Раскрывающаяся секция */}
      {isOpen && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Форма добавления */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Написать комментарий..."
              className="field flex-1 !py-2 text-sm"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="btn-neon !px-3 !py-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>

          {/* Список комментариев */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 size={20} className="text-neon animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-2">
              Пока нет комментариев. Будьте первым!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => {
                const isOwner = currentUser?.id === c.author.id;
                return (
                  <div
                    key={c.id}
                    className="group flex gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/5"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-grape/30 to-neon/30 flex items-center justify-center font-display text-xs text-white">
                      {c.author.username[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-200">
                          {c.author.username}
                        </span>
                        <span className="text-xs text-slate-500">
                          {timeAgo(c.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1 break-words">
                        {c.content}
                      </p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-coral p-1"
                        title="Удалить комментарий"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
