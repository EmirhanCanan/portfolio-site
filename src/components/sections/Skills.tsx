import { useLanguage } from '../../i18n/LanguageContext'
import { Section } from '../layout/Section'
import { Desktop, UsersThree } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { DraggableCard } from '../animations/DraggableCard'

export function Skills() {
  const { t } = useLanguage()

  return (
    <Section id="skills" title={t.skills.title}>
      <p className="text-xl text-slate-400 mb-12 max-w-2xl">{t.skills.body}</p>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DraggableCard>
            <div className="toon-card p-8 bg-[var(--color-toon-bg)] relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Desktop weight="fill" className="w-32 h-32 text-white" />
              </div>
              <h3 className="font-display text-2xl text-[var(--color-toon-blue)] uppercase tracking-wider mb-8 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                TEKNİK ARAÇLAR
              </h3>
              <ul className="flex flex-wrap gap-3 relative z-10">
                {t.skills.technical.map((skill, i) => (
                  <motion.li 
                    key={i}
                    drag
                    dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                    whileDrag={{ scale: 1.1, zIndex: 50, rotate: Math.random() * 10 - 5 }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {skill.url ? (
                      <a href={skill.url} target="_blank" rel="noreferrer" className="toon-badge hover:bg-[var(--color-toon-orange)] hover:text-white transition-colors block pointer-events-none">
                        {skill.label}
                      </a>
                    ) : (
                      <span className="toon-badge block pointer-events-none">
                        {skill.label}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          </DraggableCard>

          <DraggableCard>
            <div className="toon-card p-8 bg-[var(--color-toon-bg)] relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <UsersThree weight="fill" className="w-32 h-32 text-white" />
              </div>
              <h3 className="font-display text-2xl text-[var(--color-toon-orange)] uppercase tracking-wider mb-8 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                BECERİLER
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {t.skills.soft.map((skill, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                    <span className="w-2 h-2 bg-[var(--color-toon-orange)] rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] block"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </DraggableCard>
        </div>
      </div>
    </Section>
  )
}
