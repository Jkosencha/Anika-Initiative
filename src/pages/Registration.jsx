import { useState } from 'react'

function Registration({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('register') // 'register' | 'submit' | 'donate'
  const [agreed, setAgreed] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    extraInfo: '',
    storyIdea: '',
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreed) {
      alert('Please agree to the updates and ethical rule to continue.')
      return
    }
    console.log('Submitted Payload:', { tab: activeTab, ...formData })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-ink/20 bg-cream p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-ink/30 font-body text-sm text-ink transition-colors hover:bg-ink hover:text-cream"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-coral">
          Air It Out
        </p>
        <h2 className="mt-2 font-display text-3xl uppercase leading-tight text-ink md:text-4xl">
          Make Your Move
        </h2>
        <p className="mt-3 max-w-md font-editorial text-lg italic leading-snug text-ink/70">
          Telling a story that needed air is the first act of change.
        </p>

        {/* Action Tabs */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`border border-ink/25 px-1 py-3 text-center font-body text-xs font-semibold uppercase transition-colors ${
              activeTab === 'register'
                ? 'bg-coral text-cream'
                : 'bg-white text-ink hover:bg-coral/10'
            }`}
          >
            Register for an Event
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`border border-ink/25 px-1 py-3 text-center font-body text-xs font-semibold uppercase transition-colors ${
              activeTab === 'submit'
                ? 'bg-coral text-cream'
                : 'bg-white text-ink hover:bg-coral/10'
            }`}
          >
            Submit Art / Story
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('donate')}
            className={`border border-ink/25 px-1 py-3 text-center font-body text-xs font-semibold uppercase transition-colors ${
              activeTab === 'donate'
                ? 'bg-coral text-cream'
                : 'bg-white text-ink hover:bg-coral/10'
            }`}
          >
            Donate
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block font-body text-xs font-bold uppercase tracking-wider text-ink">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold uppercase tracking-wider text-ink">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              name="whatsapp"
              required
              placeholder="+254 712 345 678"
              value={formData.whatsapp}
              onChange={handleChange}
              className="mt-1 w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
            />
          </div>

          <div>
            <label className="block font-body text-xs font-bold uppercase tracking-wider text-ink">
              Email <span className="normal-case opacity-60">(optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
            />
          </div>

          {activeTab === 'submit' ? (
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wider text-ink">
                Your Story / Idea *
              </label>
              <textarea
                name="storyIdea"
                required
                rows={3}
                value={formData.storyIdea}
                onChange={handleChange}
                className="mt-1 w-full resize-none border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
              />
            </div>
          ) : (
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wider text-ink">
                Anything We Should Know?
              </label>
              <input
                type="text"
                name="extraInfo"
                value={formData.extraInfo}
                onChange={handleChange}
                className="mt-1 w-full border border-ink/25 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral focus:ring-2 focus:ring-coral/20"
              />
            </div>
          )}

          {/* Ethics Checkbox */}
          <div className="mt-2 flex items-start gap-3 border border-ink/20 bg-emerald-50/50 p-3">
            <input
              type="checkbox"
              id="ethics-agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-coral cursor-pointer"
            />
            <label htmlFor="ethics-agree" className="font-body text-xs text-ink/80 cursor-pointer">
              I agree to receive updates via WhatsApp and understand ANIKA's{' '}
              <span className="font-bold text-coral">Open, Never Expose</span> ethical rule.
            </label>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            className="mt-2 w-full border border-coral bg-coral py-3 font-body text-sm font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-ink hover:text-cream"
          >
            Air It Out
          </button>
        </form>
      </div>
    </div>
  )
}

export default Registration