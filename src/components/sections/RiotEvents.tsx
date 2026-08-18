import { useLanguage } from '../../i18n/LanguageContext'
import { Section } from '../layout/Section'
import { Trophy } from '@phosphor-icons/react'
import { FreeDraggableCard } from '../animations/FreeDraggableCard'
import { useRef } from 'react'

export function RiotEvents() {
  const { t } = useLanguage()
  const constraintsRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={constraintsRef} className="relative">
      <Section id="riot-events" title={t.riot.title}>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl">{t.riot.body}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.riot.events.map((event, i) => (
            <FreeDraggableCard key={i} className="h-full" constraintsRef={constraintsRef}>
            <div className="toon-card p-6 flex flex-col bg-[var(--color-toon-bg)] relative group overflow-hidden h-full">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy weight="fill" className="w-32 h-32 text-[var(--color-toon-orange)]" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-display text-xl text-white uppercase tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  {event.name}
                </h3>
              </div>
              
              <p className="text-slate-300 font-sans mb-6 flex-grow">
                {event.body}
              </p>
              
              <div className="mt-auto">
                <span className="font-mono text-[var(--color-toon-orange)] font-bold text-sm bg-[var(--color-toon-orange)]/10 px-2 py-1 rounded inline-block">
                  {event.tag}
                </span>
              </div>
            </div>
            </div>
          </FreeDraggableCard>
        ))}
      </div>
    </Section>
    </div>
  )
}
