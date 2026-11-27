import useSWR, { useSWRConfig } from 'swr';
import { fetchAPI } from '../api';

// Универсальный хук для GET-запросов с автоматическим кэшированием
export function useApi<T>(endpoint: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint,
    (url) => fetchAPI(url),
    {
      revalidateOnFocus: false, // Не обновлять при возврате на вкладку
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Игнорировать дубли в течение 5 секунд
      keepPreviousData: true, // Показывать старые данные пока грузятся новые
    },
  );

  return { data, error, isLoading, mutate };
}

// Хук для мутаций (POST/PATCH/DELETE) с инвалидацией кэша
export function useApiMutation() {
  const { mutate } = useSWRConfig();

  const execute = async (endpoint: string, options: RequestInit) => {
    const result = await fetchAPI(endpoint, options);
    // Инвалидируем все GET-запросы после мутации
    mutate((key) => typeof key === 'string' && key.startsWith('/'));
    return result;
  };

  return { execute };
}
