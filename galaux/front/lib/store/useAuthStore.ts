import { create } from 'zustand';

const KEY = 'galaux-auth';

type User = { id: number; username: string } | null;

type AuthState = {
    user: User;
    token: string | null;
    setAuth: (payload: { id?: number; username?: string }, token: string, remember?: boolean) => void;
    logout: () => void;
};

function read(): { user: User; token: string | null } {
    if (typeof window === 'undefined') return { user: null, token: null };
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (!raw) return { user: null, token: null };
    try { return JSON.parse(raw); } catch { return { user: null, token: null }; }
}

export const useAuthStore = create<AuthState>((set) => ({
    ...read(),
    setAuth: (payload, token, remember = true) => {
        const user = { id: payload.id ?? 0, username: payload.username ?? '' };
        const data = JSON.stringify({ user, token });
        (remember ? localStorage : sessionStorage).setItem(KEY, data);
        (remember ? sessionStorage : localStorage).removeItem(KEY);
        set({ user, token });
    },
    logout: () => {
        localStorage.removeItem(KEY);
        sessionStorage.removeItem(KEY);
        set({ user: null, token: null });
    },
}));