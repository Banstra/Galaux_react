import { create } from 'zustand';

const KEY = 'galaux-auth';

type User = { id: number; username: string } | null;

type AuthState = {
  user: User;
  token: string | null;
  isHydrated: boolean; // ← Новый флаг
  setAuth: (
    payload: { id?: number; username?: string },
    token: string,
    remember?: boolean,
  ) => void;
  logout: () => void;
  hydrate: () => void; // ← Метод для безопасной загрузки
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (!raw) {
      set({ isHydrated: true });
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      set({ user: parsed.user, token: parsed.token, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  setAuth: (payload, token, remember = true) => {
    const user = { id: payload.id ?? 0, username: payload.username ?? '' };
    const data = JSON.stringify({ user, token });
    (remember ? localStorage : sessionStorage).setItem(KEY, data);
    (remember ? sessionStorage : localStorage).removeItem(KEY);
    set({ user, token, isHydrated: true });
  },

  logout: () => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    set({ user: null, token: null, isHydrated: true });
  },
}));
