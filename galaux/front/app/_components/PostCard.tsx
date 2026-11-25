'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Pencil,
  ImageOff,
  Loader2,
} from 'lucide-react';
import CommentSection from './CommentSection';

export type Post = {
  id: number;
  content: string;
  image_url?: string | null;
  likes?: number;
  comments_count?: number;
  liked?: boolean;
  author: { id: number; username: string; displayName?: string | null };
  created_at: string;
};

type PostCardProps = {
  post: Post;
  currentUser: { id: number } | null;
  onLike: (postId: number) => void;
  onDelete?: (postId: number) => void;
  isLiking?: boolean;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return 'только что';
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

export default function PostCard({
  post,
  currentUser,
  onLike,
  onDelete,
  isLiking
}: PostCardProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(post.content);
  const isOwner = currentUser?.id === post.author.id;
  const displayName = post.author.displayName || post.author.username;
  const [likingPosts, setLikingPosts] = useState<Set<number>>(new Set());

  return (
    <article className="glass card-hover rounded-2xl p-6 transition-all">
      {/* Шапка поста */}
      <div className="flex items-start justify-between">
        <Link
          href={`/profile/${post.author.id}`}
          className="flex items-center gap-3 group"
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-grape/40 to-neon/40 flex items-center justify-center font-display text-white text-lg group-hover:scale-105 transition-transform">
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 group-hover:text-neon transition-colors">
              {displayName}
            </div>
            <div className="text-xs text-slate-500">
              @{post.author.username} • {timeAgo(post.created_at)}
            </div>
          </div>
        </Link>

        {/* Кнопки управления (только для автора) */}
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className="btn-ghost !px-3 !py-1.5 text-xs"
            >
              <Pencil size={12} />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="btn-ghost !px-2 !py-1.5 text-xs hover:!border-coral/50 hover:text-coral"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Контент поста */}
      <div className="mt-4">
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="field resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  /* TODO: вызвать onSave из пропсов */ setEditing(false);
                }}
                className="btn-neon !px-3 !py-1.5 text-xs"
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setText(post.content);
                  setEditing(false);
                }}
                className="btn-ghost !px-3 !py-1.5 text-xs"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        )}
      </div>

      {/* Медиа */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt=""
            className="w-full h-auto object-cover max-h-96"
          />
        ) : (
          <div className="flex h-32 items-center justify-center gap-2 bg-white/[0.02] text-slate-600">
            <ImageOff size={20} /> <span className="text-xs">Нет медиа</span>
          </div>
        )}
      </div>

      {/* Действия (Лайки, Комменты, Шер) */}
      <div className="mt-4 flex items-center gap-6 border-t border-white/5 pt-4 text-sm text-slate-400">
        <button
          onClick={() => onLike(post.id)}
          disabled={isLiking}
          className={`flex items-center gap-2 transition ${
            post.liked ? 'text-coral' : 'hover:text-coral'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLiking ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
          )}
          <span>{post.likes ?? 0}</span>
        </button>

        <span className="flex items-center gap-2">
          <MessageCircle size={16} /> {post.comments_count ?? 0}
        </span>

        <button className="ml-auto transition hover:text-neon">
          <Share2 size={16} />
        </button>
      </div>

      {/* Встроенная секция комментариев */}
      <CommentSection
        postId={post.id}
        initialCount={post.comments_count ?? 0}
      />
    </article>
  );
}
