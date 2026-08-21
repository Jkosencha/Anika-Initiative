import React from 'react'
import { accentBorder } from '../../utils/accentClasses';

export default function ProgramTabs({ programs, activeId, onSelect }) {
  return (
    <div className='border-b border-ink/10 bg-cream px-6 pt-10'>
      <div className='mx-auto flex max-w-6xl gap-6 overflow-x-auto'>
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
    </div>
    
  )
}
