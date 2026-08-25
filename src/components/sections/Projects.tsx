import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'
import { Section } from '../layout/Section'
import { ArrowSquareOut, GameController } from '@phosphor-icons/react'
import { TiltCard } from '../animations/TiltCard'

export function Projects() {
  const { t } = useLanguage()
  const [selectedProject, setSelectedProject] = useState<any>(null)

  return (
    <Section id="projects" title={t.projects.title}>
      <p className="text-xl text-slate-400 mb-12 max-w-2xl">{t.projects.body}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
        {t.projects.items.map((item) => (
          <TiltCard key={item.id}>
            <div className="toon-card p-6 flex flex-col h-full bg-[var(--color-toon-bg)] relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <GameController weight="fill" className="w-32 h-32 text-[var(--color-toon-blue)]" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[var(--color-toon-blue)] text-sm font-bold bg-[var(--color-toon-blue)]/10 px-2 py-1 rounded">
                  {item.stack}
                </span>
                {'badge' in item && (item as any).badge && (
                  <span className="toon-badge">
                    {(item as any).badge as React.ReactNode}
                  </span>
                )}
              </div>
              
              <h3 className="font-display text-2xl text-white uppercase tracking-wider mb-3 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                {item.name}
              </h3>
              
              <p className="text-slate-300 font-sans mb-6 flex-grow">
                {item.summary}
              </p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => setSelectedProject(item)}
                  className="toon-button w-full sm:w-auto inline-flex items-center gap-2 justify-center"
                >
                  {t.projects.actionReview || 'İncele'} <ArrowSquareOut weight="bold" />
                </button>
              </div>
            </div>
            </div>
          </TiltCard>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/80 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl h-[90vh] bg-[var(--color-toon-bg)] rounded-xl border-4 border-black flex flex-col overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 bg-[var(--color-toon-orange)] border-b-4 border-black flex justify-between items-center">
                <h3 className="font-display text-white text-xl uppercase tracking-wider">{selectedProject.name} - Details</h3>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="toon-button bg-white text-black hover:bg-slate-200 px-4 py-2 text-sm shadow-none"
                >
                  {t.projects.gddClose || 'Close'}
                </button>
              </div>
              <div className="w-full flex-grow border-none bg-slate-100 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl bg-white p-12 border-4 border-black rounded-xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                  <div className="text-7xl mb-6">🚧</div>
                  <h2 className="font-display text-4xl text-black uppercase tracking-wider mb-4">Coming Soon</h2>
                  <p className="text-slate-600 font-sans text-xl">
                    Yakında buraya projenin oyun içi görselleri ve detayları eklenecek.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
