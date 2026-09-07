import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest } from "../utils/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This link is invalid or has expired.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (passwordsMismatch) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword },
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.message || 'This link is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="rounded-lg py-15 px-30 bg-white/70">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <img src="/anika-logo.png" alt="ANIKA" className="w-10 h-10" />
            <span className="font-display text-2xl text-ink tracking-wide">ANIKA ADMIN</span>
          </div>

          <div className="flex h-1.5 w-full mb-10 overflow-hidden rounded-full">
            <div className="flex-1 bg-coral" />
            <div className="flex-1 bg-anika-green" />
            <div className="flex-1 bg-gold" />
            <div className="flex-1 bg-anika-blue" />
          </div>

          <h1 className="font-display text-4xl text-ink mb-3">RESET PASSWORD</h1>

          {success ? (
            <p className="font-body text-ink/70 mb-8">
              Password reset. Redirecting you to sign in…
            </p>
          ) : (
            <>
              <p className="font-body text-ink/60 mb-8">
                Choose a new password for your account.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block font-body text-xs font-semibold tracking-wide text-ink/70 uppercase mb-2">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 pr-11 font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-anika-blue"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block font-body text-xs font-semibold tracking-wide text-ink/70 uppercase mb-2">
                    Confirm new password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-anika-blue"
                    placeholder="Re-enter your new password"
                  />
                  {passwordsMismatch && (
                    <p className="font-body text-xs text-coral mt-1">Passwords don't match</p>
                  )}
                </div>

                {error && <p className="font-body text-sm text-coral">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-ink py-3 font-display tracking-wide text-cream disabled:opacity-50"
                >
                  {isSubmitting ? 'RESETTING…' : 'RESET PASSWORD'}
                </button>

                <div className="flex justify-center">
                  <Link to="/admin/login" className="font-body text-sm text-anika-blue hover:underline">
                    Back to sign in
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}