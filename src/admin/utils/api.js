const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const STORAGE_KEY = 'anika_admin_session';

function getToken() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored).token || null;
  } catch {
    return null;
  }
}


/**
 * Wraps fetch() to automatically:
 *  - prefix the API base URL
 *  - attach Authorization: Bearer <token> when a token exists
 *  - set JSON headers/parsing by default
 *  - throw a readable Error on non-2xx responses, with the backend's
 *    message when available (e.g. "Role 'comms' does not have access to 'donations'")
 *
 * Usage:
 *   const contacts = await apiRequest('/api/contacts');
 *   const updated = await apiRequest(`/api/contacts/${id}`, { method: 'PATCH', body: { status: 'archived' } });
 */


export async function apiRequest(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
    const token = getToken();
 
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...rest,
    });

    // No JSON body on some responses (e.g. 204 No Content from delete_story)
    const data = await response.json().catch(() => null);
 
    if (!response.ok) {
        if (response.status === 401) {
            // Token missing/expired/invalid -- clear the stale session and tell
            // AuthContext (which owns the real React state) to log out properly,
            // so ProtectedRoute redirects immediately instead of leaving a dead
            // session sitting in state until the next full page load.
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        const message = data?.message || data?.error || `Request failed (${response.status})`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }
 
    return data;
}