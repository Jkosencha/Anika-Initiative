import { NavLink } from 'react-router-dom'

const stats = [
  { value: '100+', label: 'Events Held', color: 'text-coral' },
  { value: '2,500+', label: 'Forum Participants', color: 'text-anika-green' },
  { value: '150', label: 'Artists Engaged', color: 'text-gold' },
  { value: '24M+', label: 'Online Impressions', color: 'text-anika-blue' },
]

const polaroid = (rotate) =>
  `bg-cream p-2 pb-6 shadow-xl ${rotate} transition-transform duration-300 ease-out hover:rotate-0`

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

      <section className="bg-black">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-12 gap-y-8 px-6 py-10 sm:grid-cols-4 sm:gap-x-16 lg:px-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`font-display text-3xl sm:text-4xl ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 font-body text-xs uppercase tracking-wide text-cream/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="font-body text-base font-semibold uppercase tracking-wide text-anika-green">About Anika</p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-tight text-ink sm:text-5xl">
              Art brings into the open what is hidden.
            </h2>
            <p className="mt-4 font-body text-lg text-ink/70">
              ANIKA Initiative is a Pan-African art-based initiative whose journey began in 2015
              with a gathering of seven poets and rappers seeking to find and amplify their
              voices.
            </p>
            <blockquote className="mt-4 border-l-2 border-coral pl-4 font-editorial text-xl italic text-ink/80">
              "We began as petals. Seven voices seated around possibility."
            </blockquote>
            <NavLink
              to="/about"
              className="mt-6 inline-block rounded border border-ink px-5 py-2 font-body text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink hover:text-cream"
            >
              Read Our Story
            </NavLink>
          </div>
          <div className={polaroid('rotate-2')}>
            <img
              src="/anika%20team.jpg"
              alt="Three ANIKA team members smiling together"
              className="aspect-4/3 w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
