const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'; // Укажите порт вашего NestJS

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Читаем токен из localStorage (где его хранит Zustand)
  const storage =
    typeof window !== 'undefined'
      ? localStorage.getItem('galaux-auth-storage')
      : null;
  let token = null;
  if (storage) {
    try {
      token = JSON.parse(storage).state.token;
    } catch (e) {
      console.error('Failed to parse auth token', e);
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}
