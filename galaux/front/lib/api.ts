const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const KEY = 'galaux-auth';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  const raw =
    localStorage.getItem(KEY) ??
    sessionStorage.getItem(KEY) ??
    localStorage.getItem('galaux-auth-storage'); // для совместимости

  if (!raw) return null;

  try {
    const p = JSON.parse(raw);
    // Поддержка как прямого формата { token: "..." }, так и формата Zustand persist { state: { token: "..." } }
    const extractedToken = p.token ?? p.state?.token ?? null;

    // Возвращаем ТОЛЬКО если это непустая строка
    return typeof extractedToken === 'string' && extractedToken.length > 0
      ? extractedToken
      : null;
  } catch {
    return null;
  }
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  console.log('🔑 [API] Endpoint:', endpoint);
  console.log(
    '🔑 [API] Token type:',
    typeof token,
    '| Value:',
    token ? `${token.substring(0, 15)}...` : 'NULL',
  );

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('📤 [API] Итоговые headers:', headers);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    const msg = Array.isArray(err.message)
      ? err.message.join('. ')
      : err.message;
    throw new Error(msg || `Request failed with status ${res.status}`);
  }

  return res.json();
}
