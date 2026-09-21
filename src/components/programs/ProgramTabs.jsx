import { accentBorder } from '../../utils/accentClasses';
import Reveal from '../Reveal';

export default function ProgramTabs({ programs, activeId, onSelect }) {
  return (
    <div className='bg-cream pt-10'>
      <Reveal>
        <div className='mx-auto max-w-6xl px-6 pb-8'>
          <p className='font-body text-base font-semibold uppercase tracking-wide text-coral'>
            Thematic Areas
          </p>
          <h2 className='mt-3 font-display text-4xl uppercase leading-tight text-ink sm:text-5xl'>
            Where art meets what society struggles to say.
          </h2>
        </div>
      </Reveal>
      <Reveal>
        <div className='mx-auto max-w-6xl px-6 flex flex-wrap gap-x-6 gap-y-3'>
        {programs.map((program) => {
          const isActive = program.id === activeId;
          return (
            <button
                key={program.id}
                onClick={() => onSelect(program.id)}
                className={`pb-3 text-sm font-semibold tracking-wide uppercase border-b-2 transition-colors cursor-pointer ${
                    isActive
                        ? `text-ink ${accentBorder[program.accentClass]}`
                        : 'text-ink/40 border-transparent'
                }`}
            >
                {program.title}
            </button>
          )
        })}
      </div>
      </Reveal>
      
    </div>
  )
}
