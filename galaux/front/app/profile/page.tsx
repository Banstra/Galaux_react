'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Loader2,
  Pencil,
  Send,
  Users,
  X,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store/useAuthStore';
import ConfirmModal from '../_components/ConfirmModal';
import PostCard, { Post } from '../_components/PostCard';

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

export type Friend = { id: number; username: string };

type SearchResultUser = {
  id: number;
  username: string;
  displayName?: string | null;
};

const DEMO_POSTS: Post[] = [
  {
    id: 999,
    content:
      'Добро пожаловать в Galaux! Это демо-пост, пока вы не создали свои собственные.',
    likes: 42,
    comments: 0,
    liked: false,
    author: { id: 0, username: 'GalauxSystem' },
    created_at: new Date().toISOString(),
  },
];

/* ---------- страница ---------- */
export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    type: 'friend' | 'post';
  } | null>(null);

  const [tab, setTab] = useState<'posts' | 'friends' | 'projects'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // 1. Гидратация при монтировании
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 2. Загрузка данных только после гидратации и наличия токена
  useEffect(() => {
    if (!isHydrated) return;
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const profileData = await fetchAPI('/auth/profile');
        setProfile(profileData);

        const postsRes = await fetchAPI('/post?page=1&limit=20');
        const items: Post[] = Array.isArray(postsRes)
          ? postsRes
          : (postsRes.items ?? postsRes.posts ?? []);

        const mine = items.filter(
          (p) => !p.author?.id || p.author.id === profileData.id,
        );
        setPosts(mine.length ? mine : DEMO_POSTS);

        const friendsRes = await fetchAPI('/friendship/my-friends');
        setFriends(Array.isArray(friendsRes) ? friendsRes : []);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
      }
    };

    loadData();
  }, [isHydrated, token, router]);

  // 3. Debounce-поиск пользователей
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
        const filtered = Array.isArray(results)
          ? results.filter((u: SearchResultUser) => u.id !== profile?.id)
          : [];
        setSearchResults(filtered);
      } catch (err) {
        console.error('Ошибка поиска:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, profile?.id]);

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
      console.error('Ошибка публикации:', err);
    } finally {
      setPublishing(false);
    }
  }

  const username = profile?.displayName || profile?.username || 'GALAUX';
  const nf = new Intl.NumberFormat('ru-RU', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return (
    <div className="relative min-h-dvh">
      {/* ===== Обложка ===== */}
      <section className="relative h-44 overflow-hidden border-b border-white/10 bg-linear-to-r from-deep via-abyss to-void md:h-56">
        <div className="absolute inset-0 bg-grid opacity-70" />
        <div className="absolute inset-0 bg-linear-to-t from-void via-void/30 to-transparent" />
        <button className="btn-ghost absolute right-5 top-5 px-3! py-1.5! text-xs">
          <Camera size={13} /> Обложка
        </button>
      </section>

      {/* ===== Шапка профиля ===== */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/15 bg-linear-to-br from-grape/50 via-neon/30 to-deep/70 font-display text-4xl text-white shadow-[0_0_35px_rgba(139,92,246,.35)]">
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
            className="btn-neon px-4! py-2! text-sm"
          >
            <Pencil size={14} /> Редактировать
          </button>
        </div>

        {/* статистика */}
        <div className="mt-5 flex gap-8 border-b border-white/10 pb-5 text-sm text-slate-400">
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
                  ? 'bg-linear-to-r from-neon/20 to-grape/20 text-ice shadow-[inset_0_0_0_1px_rgba(6,182,212,.4)]'
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
                  className="btn-neon px-4! py-2! text-sm disabled:opacity-40"
                >
                  <Send size={14} />{' '}
                  {publishing ? 'Публикация…' : 'Опубликовать'}
                </button>
              </div>
            </div>

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onLike={toggleLike}
                onDelete={(postId) =>
                  setConfirmDelete({ id: postId, type: 'post' })
                }
              />
            ))}
          </div>
        )}

        {/* ===== Друзья и Поиск ===== */}
        {tab === 'friends' && (
          <div className="space-y-6 py-6">
            <div className="glass rounded-2xl p-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Найти игрока по нику..."
                  className="field pl-10!"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              {searchQuery.length > 1 && (
                <div className="mt-4 space-y-2">
                  {searchLoading ? (
                    <div className="text-center text-sm text-slate-500 py-4">
                      <Loader2 size={20} className="animate-spin mx-auto" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-linear-to-br from-neon/30 to-grape/30 flex items-center justify-center font-display text-white text-sm">
                            {u.username[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-200">
                              {u.displayName || u.username}
                            </div>
                            <div className="text-xs text-slate-500">
                              @{u.username}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => addFriend(u.id)}
                          className="btn-neon px-3! py-1.5! text-xs"
                        >
                          <UserPlus size={14} /> Добавить
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-slate-500 py-4">
                      Никого не найдено
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Ваши друзья
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {friends.length ? (
                  friends.map((f) => (
                    <div
                      key={f.id}
                      className="glass card-hover flex items-center gap-4 rounded-2xl p-5 group"
                    >
                      <Link
                        href={`/profile/${f.id}`}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-neon/40 to-grape/40 font-display text-lg text-white transition-transform group-hover:scale-105"
                      >
                        {f.username[0]?.toUpperCase()}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/profile/${f.id}`}
                          className="font-semibold text-slate-100 truncate block hover:text-neon transition-colors"
                        >
                          {f.username}
                        </Link>
                        <div className="text-xs text-slate-500">в друзьях</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setConfirmDelete({ id: f.id, type: 'friend' })
                          }
                          className="btn-ghost p-2.5! text-slate-500 hover:text-coral hover:border-coral/30"
                          title="Удалить из друзей"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass col-span-full flex flex-col items-center rounded-2xl p-8 text-center">
                    <Users className="text-slate-600 mb-2" size={32} />
                    <p className="text-sm text-slate-400">Пока нет друзей.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Используйте поиск выше, чтобы найти игроков
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Проекты ===== */}
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

      <ConfirmModal
        isOpen={!!confirmDelete}
        title={
          confirmDelete?.type === 'friend'
            ? 'Удалить из друзей?'
            : 'Удалить пост?'
        }
        message={
          confirmDelete?.type === 'friend'
            ? 'Это действие нельзя отменить. Пользователь будет удалён из вашего списка друзей.'
            : 'Пост будет безвозвратно удалён из ленты.'
        }
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Удалить"
      />
    </div>
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
    try {
      await fetchAPI('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
    } catch {
      setNote('Изменения сохранены локально — проверьте эндпоинт на бэкенде.');
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
