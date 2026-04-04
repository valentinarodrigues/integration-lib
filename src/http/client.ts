import { callWithRetry } from '../utils/retry';
import { UpstreamApiError } from '../errors';

export interface ApiClientOptions {
  baseUrl: string;
  getToken: () => Promise<string>;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export function createApiClient(options: ApiClientOptions) {
  const { baseUrl, getToken, defaultHeaders = {}, timeoutMs = 10000 } = options;

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await getToken();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await callWithRetry(
        () =>
          fetch(`${baseUrl}${path}`, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              ...defaultHeaders,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
          }),
        {
          shouldRetry: (e) => {
            if (e instanceof UpstreamApiError) return e.isRetryable;
            return true;
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new UpstreamApiError(res.status, baseUrl, text);
      }

      return res.json() as Promise<T>;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
    put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
    patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
    delete: <T>(path: string) => request<T>('DELETE', path),
  };
}
