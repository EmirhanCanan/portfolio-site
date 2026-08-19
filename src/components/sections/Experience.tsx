import { useLanguage } from '../../i18n/LanguageContext'
import { Section } from '../layout/Section'
import { Briefcase } from '@phosphor-icons/react'
import { DraggableCard } from '../animations/DraggableCard'

export function Experience() {
  const { t } = useLanguage()

  return (
    <Section id="experience" title={t.experience.title}>
      <p className="text-xl text-slate-400 mb-12 max-w-2xl">{t.experience.body}</p>
      
      <div className="space-y-8 relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-[var(--color-toon-blue)] opacity-30"></div>
        
        {t.experience.items.map((item, i) => (
          <DraggableCard key={i}>
            <div className="toon-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start relative z-10 bg-[var(--color-toon-bg)]">
              <div className="flex-shrink-0 bg-[var(--color-toon-orange)] border-2 border-black rounded-lg p-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)] mt-1">
                <Briefcase weight="bold" className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-2xl text-white uppercase tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,1)] mb-1 break-words">
                      {item.role}
                    </h3>
                    <a href={item.placeUrl} target="_blank" rel="noreferrer" className="text-xl font-bold text-[var(--color-toon-blue)] hover:text-[var(--color-toon-orange)] transition-colors underline decoration-2 underline-offset-4">
                      {item.place}
                    </a>
                  </div>
                  <span className={`shrink-0 font-mono font-bold px-3 py-1 rounded border-2 flex items-center gap-2 ${
                    item.isCurrent 
                      ? 'bg-green-500/20 text-green-400 border-green-500 shadow-[2px_2px_0_0_rgba(34,197,94,0.5)]' 
                      : 'bg-[var(--color-toon-blue)]/20 text-[var(--color-toon-blue)] border-[var(--color-toon-blue)] shadow-[2px_2px_0_0_rgba(59,130,246,0.5)]'
                  }`}>
                    {item.isCurrent && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    {item.period}
                  </span>
                </div>
                
                <ul className="space-y-2 mt-4">
                  {item.points.map((bullet, j) => (
                    <li key={j} className="flex gap-3 text-slate-300 items-start font-sans">
                      <span className="text-[var(--color-toon-orange)] font-bold text-xl leading-none mt-1">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DraggableCard>
        ))}
      </div>
    </Section>
  )
}
