import React from 'react'
import { Link } from "react-router-dom";
import { useState } from "react"
import { apiRequest } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email },
      });
    } catch (err) {
      // Network/server errors aside, the backend always returns a generic
      // 200 for valid requests — we still show the same message either way
      // so we don't leak anything client-side either.
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
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

          <h1 className="font-display text-4xl text-ink mb-3">FORGOT PASSWORD</h1>

          {submitted ? (
            <>
              <p className="font-body text-ink/70 mb-8">
                If an account exists with that email, we've sent password reset instructions.
                The link will expire in 20 minutes.
              </p>
              <Link to="/admin/login" className="font-body text-sm text-anika-blue hover:underline">
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <p className="font-body text-ink/60 mb-8">
                Enter your email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block font-body text-xs font-semibold tracking-wide text-ink/70 uppercase mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-anika-blue"
                    placeholder="you@anikainitiative.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-ink py-3 font-display tracking-wide text-cream disabled:opacity-50"
                >
                  {isSubmitting ? 'SENDING…' : 'SEND RESET LINK'}
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
