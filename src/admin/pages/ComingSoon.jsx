function ComingSoon({ title }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 text-center dark:border-white/15">
      <h1 className="font-display text-2xl tracking-wide">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-ink/60 dark:text-cream/60">
        This section is under construction — check back soon.
      </p>
    </div>
  )
}

export default ComingSoon
