'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Globe,
  Loader2,
  MessageCircle,
  Pencil,
  Send,
  Users,
  UserPlus,
  X,
} from 'lucide-react';
import { Post, PostCard } from './PostCard';

/* ---------- Типы ---------- */
export type Profile = {
  id: number;
  username: string;
  displayName?: string | null;
  email?: string;
  profile_info?: string | null;
  telegram_link?: string | null;
  discord_link?: string | null;
  money?: number;
  offline?: boolean;
  created_at?: string;
  role?: { name?: string } | null;
};

export type Friend = { id: number; username: string };

export type SearchResultUser = {
  id: number;
  username: string;
  displayName?: string | null;
};

export type FriendStatus = 'none' | 'pending' | 'friends';

export type TabKey = 'posts' | 'friends' | 'projects';

export interface UserProfileViewProps {
  profile: Profile;
  isOwner: boolean;
  friendStatus?: FriendStatus;
  friends?: Friend[];
  posts?: Post[];
  searchResults?: SearchResultUser[];
  searchLoading?: boolean;
  searchQuery?: string;
  draft?: string;
  publishing?: boolean;
  removingFriendId?: number | null;
  tab?: TabKey;

  // Колбэки для владельца
  onEdit?: () => void;
  onPublish?: () => void;
  onDraftChange?: (value: string) => void;
  onTabChange?: (tab: TabKey) => void;
  onSearchChange?: (value: string) => void;
  onLike?: (postId: number) => void;
  onDeletePost?: (postId: number) => void;
  onRemoveFriend?: (friendId: number) => void;

  // Колбэки для гостя
  onAddFriend?: () => void;
}

const nf = new Intl.NumberFormat('ru-RU', {
  notation: 'compact',
  compactDisplay: 'short',
});

export default function UserProfileView({
  profile,
  isOwner,
  friendStatus = 'none',
  friends = [],
  posts = [],
  searchResults = [],
  searchLoading = false,
  searchQuery = '',
  draft = '',
  publishing = false,
  removingFriendId = null,
  tab = 'posts',

  onEdit,
  onPublish,
  onDraftChange,
  onTabChange,
  onSearchChange,
  onLike,
  onDeletePost,
  onRemoveFriend,
  onAddFriend,
}: UserProfileViewProps) {
  const displayName = profile.displayName || profile.username;
  const [localTab, setLocalTab] = useState<TabKey>('posts');
  const activeTab = isOwner ? tab : localTab;

  const handleTabClick = (t: TabKey) => {
    if (isOwner) onTabChange?.(t);
    else setLocalTab(t);
  };

  return (
    <div className="relative min-h-dvh">
      {/* ===== Обложка ===== */}
      <section className="relative h-44 overflow-hidden border-b border-white/10 bg-linear-to-r from-deep via-abyss to-void md:h-56 z-0">
        <div className="absolute inset-0 bg-grid opacity-70" />
        <div className="absolute inset-0 bg-linear-to-t from-void via-void/30 to-transparent" />
        {isOwner && (
          <button className="btn-ghost absolute right-5 top-5 px-3! py-1.5! text-xs">
            <Camera size={13} /> Обложка
          </button>
        )}
      </section>

      {/* ===== Шапка профиля ===== */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Аватар */}
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/15 bg-linear-to-br from-grape/50 via-neon/30 to-deep/70 font-display text-4xl text-white shadow-[0_0_35px_rgba(139,92,246,.35)]">
              {displayName[0]?.toUpperCase()}
            </div>
            {isOwner && (
              <button className="absolute -bottom-2 -right-2 rounded-xl border border-white/15 bg-void/80 p-2 text-ice transition hover:text-neon">
                <Camera size={14} />
              </button>
            )}
          </div>

          {/* Информация */}
          <div className="flex-1">
            <div className="flex items-center gap-3 z-2">
              <h1 className="font-display text-3xl tracking-wide text-white z-2">
                {displayName}
              </h1>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  profile.offline === false ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
                title={profile.offline === false ? 'онлайн' : 'оффлайн'}
              />
            </div>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              {profile.profile_info ||
                (isOwner
                  ? 'Расскажите о себе — это увидят игроки на страницах проектов.'
                  : 'Пользователь не оставил описания.')}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {profile.role?.name && (
                <span className="chip">{profile.role.name}</span>
              )}
              {profile.telegram_link && (
                <a
                  href={profile.telegram_link}
                  className="chip hover:text-neon"
                >
                  Telegram
                </a>
              )}
              {profile.discord_link && (
                <a href={profile.discord_link} className="chip hover:text-neon">
                  Discord
                </a>
              )}
              {isOwner && profile.money !== undefined && (
                <span className="chip">
                  💎 {nf.format(profile.money)} Galaux
                </span>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            {isOwner ? (
              <button onClick={onEdit} className="btn-neon px-4! py-2! text-sm">
                <Pencil size={14} /> Редактировать
              </button>
            ) : (
              <>
                {friendStatus === 'none' && (
                  <button
                    onClick={onAddFriend}
                    className="btn-neon px-6! py-3! text-sm"
                  >
                    <UserPlus size={16} /> Добавить в друзья
                  </button>
                )}
                {friendStatus === 'pending' && (
                  <button
                    disabled
                    className="btn-ghost px-6! py-3! text-sm opacity-50 cursor-not-allowed"
                  >
                    Заявка отправлена
                  </button>
                )}
                {friendStatus === 'friends' && (
                  <button className="btn-ghost px-6! py-3! text-sm border-emerald-500/30 text-emerald-400">
                    <Users size={16} /> В друзьях
                  </button>
                )}
                <button className="btn-ghost p-3!" title="Написать сообщение">
                  <MessageCircle size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-5 flex gap-8 border-b border-white/10 pb-5 text-sm text-slate-400">
          <span>
            <b className="text-ice">{nf.format(0)}</b> подписчиков
          </span>
          <span>
            <b className="text-ice">{nf.format(friends.length)}</b> друзей
          </span>
          <span>
            <b className="text-ice">{nf.format(posts.length)}</b> постов
          </span>
        </div>

        {/* ===== Контент ===== */}
        {isOwner ? (
          <OwnerContent
            tab={activeTab}
            friends={friends}
            posts={posts}
            searchResults={searchResults}
            searchLoading={searchLoading}
            searchQuery={searchQuery}
            draft={draft}
            publishing={publishing}
            removingFriendId={removingFriendId}
            onTabChange={handleTabClick}
            onPublish={onPublish}
            onDraftChange={onDraftChange}
            onSearchChange={onSearchChange}
            onLike={onLike}
            onDeletePost={onDeletePost}
            onRemoveFriend={onRemoveFriend}
          />
        ) : (
          <GuestContent
            tab={activeTab}
            posts={posts}
            onTabChange={handleTabClick}
          />
        )}
      </section>
    </div>
  );
}

/* ---------- Контент для владельца ---------- */
function OwnerContent({
  tab,
  friends,
  posts,
  searchResults,
  searchLoading,
  searchQuery,
  draft,
  publishing,
  removingFriendId,
  onTabChange,
  onPublish,
  onDraftChange,
  onSearchChange,
  onLike,
  onDeletePost,
  onRemoveFriend,
}: {
  tab: TabKey;
  friends: Friend[];
  posts: Post[];
  searchResults: SearchResultUser[];
  searchLoading: boolean;
  searchQuery: string;
  draft: string;
  publishing: boolean;
  removingFriendId: number | null;
  onTabChange: (t: TabKey) => void;
  onPublish?: () => void;
  onDraftChange?: (v: string) => void;
  onSearchChange?: (v: string) => void;
  onLike?: (id: number) => void;
  onDeletePost?: (id: number) => void;
  onRemoveFriend?: (id: number) => void;
}) {
  return (
    <>
      {/* Вкладки */}
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
            onClick={() => onTabChange(key)}
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

      {/* Посты */}
      {tab === 'posts' && (
        <div className="space-y-5 py-6">
          <div className="glass rounded-2xl p-5">
            <textarea
              value={draft}
              onChange={(e) => onDraftChange?.(e.target.value)}
              placeholder="Что нового на вашем сервере?"
              rows={3}
              className="field resize-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                {draft.length}/2000
              </span>
              <button
                onClick={onPublish}
                disabled={!draft.trim() || publishing}
                className="btn-neon px-4! py-2! text-sm disabled:opacity-40"
              >
                <Send size={14} /> {publishing ? 'Публикация…' : 'Опубликовать'}
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={null}
              onLike={onLike ?? (() => {})}
              onDelete={
                onDeletePost ? (id: number) => onDeletePost(id) : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Друзья */}
      {tab === 'friends' && (
        <div className="space-y-6 py-6">
          {/* Поиск */}
          <div className="glass rounded-2xl p-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Найти игрока по нику..."
                className="field pl-10!"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
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
                      <Link
                        href={`/profile/${u.id}`}
                        className="btn-ghost px-3! py-1.5! text-xs"
                      >
                        Профиль
                      </Link>
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

          {/* Список друзей */}
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
                    <button
                      onClick={() => onRemoveFriend?.(f.id)}
                      disabled={removingFriendId === f.id}
                      className="btn-ghost p-2.5! text-slate-500 hover:text-coral hover:border-coral/30 disabled:opacity-50"
                      title="Удалить из друзей"
                    >
                      {removingFriendId === f.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
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

      {/* Проекты */}
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
    </>
  );
}

/* ---------- Контент для гостя ---------- */
function GuestContent({
  tab,
  posts,
  onTabChange,
}: {
  tab: TabKey;
  posts: Post[];
  onTabChange: (t: TabKey) => void;
}) {
  return (
    <>
      <div className="mt-5 flex gap-2">
        {(['posts', 'friends', 'projects'] as const).map((key) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              tab === key
                ? 'bg-linear-to-r from-neon/20 to-grape/20 text-ice shadow-[inset_0_0_0_1px_rgba(6,182,212,.4)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {key === 'posts'
              ? 'Посты'
              : key === 'friends'
                ? 'Друзья'
                : 'Проекты'}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="space-y-5 py-6">
          {posts.length ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={null}
                onLike={() => {}}
              />
            ))
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-slate-500">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p>Пользователь пока не опубликовал никаких постов.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'friends' && (
        <div className="glass rounded-2xl p-12 text-center text-slate-500 mt-6">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p>Список друзей скрыт настройками приватности.</p>
        </div>
      )}

      {tab === 'projects' && (
        <div className="glass rounded-2xl p-12 text-center text-slate-500 mt-6">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p>Проекты пользователя пока недоступны для просмотра.</p>
        </div>
      )}
    </>
  );
}
