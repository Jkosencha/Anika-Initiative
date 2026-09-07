import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

/**
 * A confirmation modal that auto-dismisses after `duration` ms, so the
 * underlying form is immediately ready for another submission instead of
 * showing a permanent inline message until the page is refreshed.
 */
function SuccessModal({ open, title, message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-anika-green" />
        <p className="mt-4 font-display text-xl uppercase tracking-wide text-ink">{title}</p>
        <p className="mt-2 font-body text-sm text-ink/70">{message}</p>
      </div>
    </div>
  )
}

export default SuccessModal
