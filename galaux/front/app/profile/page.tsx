'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Heart,
  ImageOff,
  MessageCircle,
  Pencil,
  Send,
  Share2,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';

/* ---------- типы ---------- */
type Profile = {
  id: number;
  username: string;
  displayName?: string | null;
  email: string;
  profile_info?: string | null;
  telegram_link?: string | null;
  discord_link?: string | null;
  money?: number;
  offline?: boolean;
  created_at?: string;
  role?: { name?: string } | null;
};
type Post = {
  id: number;
  content: string;
  image_url?: string | null;
  likes?: number;
  comments?: number;
  liked?: boolean;
  author?: { id?: number; username?: string };
  created_at?: string;
};
type Friend = { id: number; username: string };

const nf = new Intl.NumberFormat('ru-RU', {
  notation: 'compact',
  compactDisplay: 'short',
});

const DEMO_POSTS: Post[] = [
  {
    id: 1,
    content:
      'Обновил сборку Create: Новой эры до 1.20.1 — переработал логистику на спавне, добавил поезда и ветряки. Заходите!',
    likes: 128,
    comments: 24,
  },
  {
    id: 2,
    content:
      'В субботу в 20:00 МСК стартует сезонное PvP-событие. Призы — привилегии и внутриигровая валюта.',
    likes: 96,
    comments: 41,
  },
];

function timeAgo(iso?: string) {
  if (!iso) return 'недавно';
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return 'только что';
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

/* ---------- страница ---------- */
export default function ProfilePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [tab, setTab] = useState<'posts' | 'friends' | 'projects'>('posts');
  const [draft, setDraft] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    fetchAPI('/auth/profile')
      .then(setProfile)
      .catch(() => {});

    fetchAPI('/post?page=1&limit=20')
      .then((r) => {
        const items: Post[] = Array.isArray(r) ? r : (r.items ?? r.posts ?? []);
        // TODO: добавить на бэкенде GET /post/user/:id — пока фильтруем ленту на клиенте
        const mine = profile
          ? items.filter((p) => !p.author?.id || p.author.id === profile.id)
          : items;
        setPosts(mine.length ? mine : DEMO_POSTS);
      })
      .catch(() => setPosts(DEMO_POSTS));

    fetchAPI('/friendship/my-friends')
      .then((r) => setFriends(Array.isArray(r) ? r : []))
      .catch(() => {});
  }, [token]);

  const username = profile?.displayName || profile?.username || 'GALAUX';

  /* лайк — optimistic + POST /post/:id/like */
  async function toggleLike(p: Post) {
    setPosts((ps) =>
      ps.map((x) =>
        x.id === p.id
          ? {
              ...x,
              liked: !x.liked,
              likes: (x.likes ?? 0) + (x.liked ? -1 : 1),
            }
          : x,
      ),
    );
    try {
      await fetchAPI(`/post/${p.id}/like`, { method: 'POST' });
    } catch {}
  }

  /* публикация */
  async function publish() {
    if (!draft.trim() || publishing) return;
    setPublishing(true);
    try {
      const created = await fetchAPI('/post', {
        method: 'POST',
        body: JSON.stringify({ content: draft }),
      });
      setPosts((ps) => [{ ...created, likes: 0, comments: 0 }, ...ps]);
      setDraft('');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="relative min-h-dvh">

      {/* ===== Обложка (была «шахматкой» → градиент + сетка) ===== */}
      <section className="relative h-44 overflow-hidden border-b border-white/10 bg-gradient-to-r from-deep via-abyss to-void md:h-56">
        <div className="absolute inset-0 bg-grid opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
        <button className="btn-ghost absolute right-5 top-5 !px-3 !py-1.5 text-xs">
          <Camera size={13} /> Обложка
        </button>
      </section>

      {/* ===== Шапка профиля ===== */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-grape/50 via-neon/30 to-deep/70 font-display text-4xl text-white shadow-[0_0_35px_rgba(139,92,246,.35)]">
              {username[0]?.toUpperCase()}
            </div>
            <button className="absolute -bottom-2 -right-2 rounded-xl border border-white/15 bg-void/80 p-2 text-ice transition hover:text-neon">
              <Camera size={14} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl tracking-wide text-white">
                {username}
              </h1>
              <span
                className={`h-2.5 w-2.5 rounded-full ${profile?.offline === false ? 'bg-emerald-400' : 'bg-slate-600'}`}
                title={profile?.offline === false ? 'онлайн' : 'оффлайн'}
              />
            </div>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              {profile?.profile_info ||
                'Расскажите о себе — это увидят игроки на страницах проектов.'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {profile?.role?.name && (
                <span className="chip">{profile.role.name}</span>
              )}
              {profile?.telegram_link && (
                <a
                  href={profile.telegram_link}
                  className="chip hover:text-neon"
                >
                  Telegram
                </a>
              )}
              {profile?.discord_link && (
                <a href={profile.discord_link} className="chip hover:text-neon">
                  Discord
                </a>
              )}
              <span className="chip">
                💎 {nf.format(profile?.money ?? 0)} Galaux
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="btn-neon !px-4 !py-2 text-sm"
          >
            <Pencil size={14} /> Редактировать
          </button>
        </div>

        {/* статистика */}
        <div className="mt-5 flex gap-8 border-b border-white/10 pb-5 text-sm text-slate-400">
          {/* TODO: бэкенд не отдаёт подписчиков — добавить GET /user/:id/stats */}
          <span>
            <b className="text-ice">{nf.format(0)}</b> подписчиков
          </span>
          <span>
            <b className="text-ice">{nf.format(friends.length)}</b> друзей
          </span>
          <span>
            <b className="text-ice">{posts.length}</b> постов
          </span>
        </div>

        {/* вкладки */}
        <div className="mt-5 flex gap-2">
          {(
            [
              ['posts', 'Посты'],
              ['friends', 'Друзья'],
              ['projects', 'Проекты'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                tab === key
                  ? 'bg-gradient-to-r from-neon/20 to-grape/20 text-ice shadow-[inset_0_0_0_1px_rgba(6,182,212,.4)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ===== Посты ===== */}
        {tab === 'posts' && (
          <div className="space-y-5 py-6">
            {/* композер */}
            <div className="glass rounded-2xl p-5">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Что нового на вашем сервере?"
                rows={3}
                className="field resize-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  {draft.length}/2000
                </span>
                <button
                  onClick={publish}
                  disabled={!draft.trim() || publishing}
                  className="btn-neon !px-4 !py-2 text-sm disabled:opacity-40"
                >
                  <Send size={14} />{' '}
                  {publishing ? 'Публикация…' : 'Опубликовать'}
                </button>
              </div>
            </div>

            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                username={username}
                onLike={() => toggleLike(p)}
                onDelete={() =>
                  setPosts((ps) => ps.filter((x) => x.id !== p.id))
                }
                onSave={(content) =>
                  setPosts((ps) =>
                    ps.map((x) => (x.id === p.id ? { ...x, content } : x)),
                  )
                }
              />
            ))}
          </div>
        )}

        {/* ===== Друзья ===== */}
        {tab === 'friends' && (
          <div className="grid gap-4 py-6 sm:grid-cols-2">
            {friends.length ? (
              friends.map((f) => (
                <div
                  key={f.id}
                  className="glass card-hover flex items-center gap-4 rounded-2xl p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon/40 to-grape/40 font-display text-lg text-white">
                    {f.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-100">
                      {f.username}
                    </div>
                    <div className="text-xs text-slate-500">в друзьях</div>
                  </div>
                  <MessageCircle
                    size={18}
                    className="text-slate-500 transition hover:text-neon"
                  />
                </div>
              ))
            ) : (
              <div className="glass col-span-full flex flex-col items-center rounded-2xl p-12 text-center">
                <Users className="text-slate-600" size={36} />
                <p className="mt-4 text-sm text-slate-400">
                  Пока нет друзей. Добавьте игроков по ID через{' '}
                  <code className="text-ice">POST /friendship/request</code>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== Проекты (заглушка под серверный модуль) ===== */}
        {tab === 'projects' && (
          <div className="grid gap-4 py-6 sm:grid-cols-2">
            {['SkyFactory 4', 'Create: Новой эры'].map((name) => (
              <div key={name} className="glass card-hover rounded-2xl p-6">
                <div className="font-semibold text-slate-100">{name}</div>
                <p className="mt-1 text-xs text-slate-500">
                  Модуль серверов ещё в разработке — здесь будут ваши проекты,
                  магазин и статистика онлайна.
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {editOpen && (
        <EditModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={(patch) =>
            setProfile((pr) => (pr ? { ...pr, ...patch } : pr))
          }
        />
      )}

    </div>
  );
}

/* ---------- карточка поста ---------- */
function PostCard({
  post,
  username,
  onLike,
  onDelete,
  onSave,
}: {
  post: Post;
  username: string;
  onLike: () => void;
  onDelete: () => void;
  onSave: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(post.content);

  return (
    <article className="glass card-hover rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon/40 to-grape/40 font-display text-white">
            {username[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">
              {username}
            </div>
            <div className="text-xs text-slate-500">
              {timeAgo(post.created_at)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="btn-ghost !px-3 !py-1.5 text-xs"
          >
            <Pencil size={12} /> Редактировать
          </button>
          <button
            onClick={onDelete}
            className="btn-ghost !px-2 !py-1.5 text-xs hover:!border-coral/50"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="mt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="field resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onSave(text);
                setEditing(false);
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
        <p className="mt-4 text-slate-300">{post.content}</p>
      )}

      {/* медиа: картинка или «плейсхолдер» вместо шахматки из макета */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt=""
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 items-center justify-center gap-2 bg-white/[0.03] text-slate-600">
            <ImageOff size={24} />{' '}
            <span className="text-xs">Медиа не загружено</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6 border-t border-white/5 pt-4 text-sm text-slate-400">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 transition ${post.liked ? 'text-coral' : 'hover:text-coral'}`}
        >
          <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />{' '}
          {post.likes ?? 0}
        </button>
        {/* TODO: эндпоинт комментариев ещё не готов */}
        <span className="flex items-center gap-2">
          <MessageCircle size={16} /> {post.comments ?? 0}
        </span>
        <button className="ml-auto transition hover:text-neon">
          <Share2 size={16} />
        </button>
      </div>
    </article>
  );
}

/* ---------- модалка редактирования ---------- */
function EditModal({
  profile,
  onClose,
  onSave,
}: {
  profile: Profile | null;
  onClose: () => void;
  onSave: (p: Partial<Profile>) => void;
}) {
  const [form, setForm] = useState({
    displayName: profile?.displayName ?? '',
    profile_info: profile?.profile_info ?? '',
    telegram_link: profile?.telegram_link ?? '',
    discord_link: profile?.discord_link ?? '',
  });
  const [note, setNote] = useState('');

  async function save() {
    // TODO: на бэкенде пока нет PATCH /user — добавить и убрать локальный фолбэк
    try {
      await fetchAPI('/user', { method: 'PATCH', body: JSON.stringify(form) });
    } catch {
      setNote('Изменения сохранены локально — на бэкенде ещё нет PATCH /user.');
    }
    onSave(form);
    setTimeout(onClose, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl tracking-wide text-white">
            Редактировать профиль
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-coral">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Отображаемое имя</label>
            <input
              className="field"
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              placeholder={profile?.username}
            />
          </div>
          <div>
            <label className="label">О себе</label>
            <textarea
              className="field resize-none"
              rows={3}
              value={form.profile_info}
              onChange={(e) =>
                setForm({ ...form, profile_info: e.target.value })
              }
              placeholder="Пара слов о вас и ваших проектах"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Telegram</label>
              <input
                className="field"
                value={form.telegram_link}
                onChange={(e) =>
                  setForm({ ...form, telegram_link: e.target.value })
                }
                placeholder="@nickname"
              />
            </div>
            <div>
              <label className="label">Discord</label>
              <input
                className="field"
                value={form.discord_link}
                onChange={(e) =>
                  setForm({ ...form, discord_link: e.target.value })
                }
                placeholder="discord.gg/…"
              />
            </div>
          </div>
          {note && <p className="text-xs text-coral">{note}</p>}
          <button onClick={save} className="btn-neon w-full">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
