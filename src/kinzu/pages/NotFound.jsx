import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-body text-base font-semibold uppercase tracking-[0.25em] text-coral">Error 404</p>
        <h1 className="mt-3 font-display text-6xl uppercase tracking-wide">Silence.</h1>
        <p className="mx-auto mt-5 max-w-md font-body text-gray-700">
          This page went quiet — it doesn’t exist (or has moved). Let’s get you back to where the
          voices are.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/" className="bg-coral px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream hover:bg-ink">
            Back Home
          </Link>
          <Link to="/events" className="border border-ink px-5 py-3 font-body text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink hover:text-cream">
            View Events
          </Link>
        </div>
      </div>
    </section>
  );
}
