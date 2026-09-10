// Cloudflare's build-time injection of VITE_API_BASE_URL has repeatedly
// failed to reach the actual Vite build for this project, even when
// correctly configured in the dashboard, surviving cache clears and a full
// repo reconnect. import.meta.env.PROD is set natively by Vite itself (not a
// custom variable Cloudflare has to pass through), so production builds fall
// back to the real Render backend instead of a relative/same-origin path,
// which has no /api routes on the Workers static-asset domain.
export const RENDER_BACKEND_URL = 'https://anika-initiative.onrender.com';

export function resolveApiBase(devDefault = '') {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? RENDER_BACKEND_URL : devDefault)
  );
}
