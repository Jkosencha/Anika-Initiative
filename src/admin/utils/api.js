import { resolveApiBase } from '../../lib/apiBaseUrl';

const API_BASE_URL = resolveApiBase('');
const STORAGE_KEY = 'anika_admin_session';

function getSession() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveAccessToken(newAccessToken) {
  const session = getSession();
  if (!session) return;
  session.token = newAccessToken;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('auth:unauthorized'));
}

let refreshPromise = null;

async function refreshAccessToken() {
  const session = getSession();
  if (!session?.refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.refreshToken}` },
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        return data?.access_token || null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * apiRequest – authenticated fetch with token refresh and FormData support.
 */
export async function apiRequest(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const isFormData = body instanceof FormData;

  const doFetch = async () => {
    const session = getSession();
    const token = session?.token;

    const requestHeaders = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    const requestBody = isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined);

    // Render's free tier occasionally drops/resets a connection mid-response
    // (no code fix for that -- it's the hosting tier), which surfaces here as
    // fetch() throwing "Failed to fetch" with no HTTP response at all. GET is
    // safe to silently retry once since it has no side effects; POST/PATCH/
    // DELETE are left alone so a dropped response never causes a duplicate
    // write.
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: requestHeaders,
        body: requestBody,
        ...rest,
      });
      const data = await response.json().catch(() => null);
      return { response, data };
    } catch (err) {
      if (method !== 'GET') throw err;
      await sleep(800);
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: requestHeaders,
        body: requestBody,
        ...rest,
      });
      const data = await response.json().catch(() => null);
      return { response, data };
    }
  };

  let response, data;
  try {
    ({ response, data } = await doFetch());
  } catch (err) {
    if (method === 'GET') throw err;
    // A dropped connection on a write leaves it genuinely unclear whether
    // the server received it -- surface that instead of the raw browser
    // "Failed to fetch", so the list gets checked before retrying.
    throw new Error('Network error -- please check the list before retrying, in case this already went through.', { cause: err });
  }

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      saveAccessToken(newAccessToken);
      ({ response, data } = await doFetch());
    } else {
      clearSession();
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}