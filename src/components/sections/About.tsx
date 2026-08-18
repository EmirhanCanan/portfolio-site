import { useLanguage } from '../../i18n/LanguageContext'
import { translations } from '../../i18n/translations'
import { Section } from '../layout/Section'
import { GraduationCap, Translate } from '@phosphor-icons/react'
import { DraggableCard } from '../animations/DraggableCard'
import { InteractiveTerminal } from '../animations/InteractiveTerminal'

export function About() {
  const { t } = useLanguage()



  return (
    <Section id="about" title={t.about.title}>
      <p className="text-lg md:text-xl text-slate-300 font-mono mb-8">
        💡 {t === translations.tr ? 'İpuçları: ' : 'Tip: Try commands like '}
        <span className="bg-slate-800 text-toon-blue px-2 py-1 rounded font-bold">help</span>, 
        <span className="bg-slate-800 text-toon-blue px-2 py-1 rounded ml-2 font-bold">info</span> 
        {t === translations.tr ? ' gibi komutları deneyin.' : ' or others.'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DraggableCard className="lg:col-span-2">
          <div className="h-full min-h-[400px] flex flex-col">
            <InteractiveTerminal />
          </div>
        </DraggableCard>
        
        <div className="space-y-8">
          <DraggableCard>
            <div className="toon-card p-6 border-l-8 border-l-[var(--color-toon-blue)] h-full">
            <div className="flex items-center gap-3 mb-4 text-[var(--color-toon-blue)]">
              <GraduationCap weight="fill" className="w-8 h-8" />
              <h3 className="font-display text-xl uppercase tracking-wider">{t.about.educationTitle}</h3>
            </div>
            <p className="font-bold text-white mb-2">{t.about.educationDegree}</p>
            <p className="text-slate-400 mb-2">
              <a href={t.about.educationSchoolUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--color-toon-orange)] underline decoration-2 underline-offset-4">
                {t.about.educationSchool}
              </a>
            </p>
            <p className="font-mono text-[var(--color-toon-blue)] bg-[var(--color-toon-blue)]/10 inline-block px-2 py-1 rounded">
              {t.about.educationPeriod}
            </p>
            </div>
          </DraggableCard>

          <DraggableCard>
            <div className="toon-card p-6 border-l-8 border-l-[var(--color-toon-orange)] h-full">
            <div className="flex items-center gap-3 mb-4 text-[var(--color-toon-orange)]">
              <Translate weight="fill" className="w-8 h-8" />
              <h3 className="font-display text-xl uppercase tracking-wider">{t.about.languagesTitle}</h3>
            </div>
            <p className="font-mono text-lg text-slate-300">
              {t.about.languages}
            </p>
            </div>
          </DraggableCard>
        </div>
      </div>
    </Section>
  )
}
