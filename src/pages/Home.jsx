import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-black text-cream">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.55)), url('/image11.jpg')",
            backgroundBlendMode: 'multiply',
            filter: 'grayscale(1)',
          }}
        />
        <img
          src="/anika-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 w-md rotate-12 opacity-90 sm:w-xl"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-24 xl:px-34">
          <div className="max-w-5xl text-left">
            <span className="-rotate-3 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1 font-body text-sm font-semibold uppercase tracking-wide text-ink">
              A Pan-African art-based initiative
            </span>
            <h1 className="mt-6 font-display text-5xl uppercase leading-tight sm:text-8xl">
              Change the world,
              <br />
              <span className="text-coral">art at a time.</span>
            </h1>
            <p className="mt-6 max-w-xl font-body text-lg text-cream/80">
              Over nine years of art-based work turning spoken word, theatre and visual art into
              open conversation, surfacing what society keeps quiet, and amplifying young voices
              across Africa.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <NavLink
                to="/programs"
                className="rounded-full bg-coral px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream hover:opacity-90"
              >
                Explore Our Work
              </NavLink>
              <NavLink
                to="/get-involved"
                className="rounded-full border border-cream/40 px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-cream hover:border-cream"
              >
                Support Us
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
