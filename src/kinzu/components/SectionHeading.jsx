const accentText = {
  coral: 'text-coral',
  gold: 'text-gold',
  green: 'text-anika-green',
  blue: 'text-anika-blue',
  ink: 'text-ink',
}

export default function SectionHeading({ kicker, title, accent = 'coral' }) {
  return (
    <div>
      <p className={`font-body text-base font-semibold uppercase tracking-[0.25em] ${accentText[accent] || accentText.coral}`}>
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-4xl uppercase leading-tight text-ink sm:text-5xl">
        {title}
      </h2>
    </div>
  )
}