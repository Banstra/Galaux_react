const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const KEY = 'galaux-auth';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw =
    localStorage.getItem(KEY) ??
    sessionStorage.getItem(KEY) ??
    localStorage.getItem('galaux-auth-storage'); // совместимость со старым ключом
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    return p.token ?? p.state?.token ?? null;
  } catch {
    return null;
  }
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    const msg = Array.isArray(err.message)
      ? err.message.join('. ')
      : err.message;
    throw new Error(msg || 'Request failed');
  }
  return res.json();
}
