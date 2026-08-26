import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'
import { Section } from '../layout/Section'
import { ArrowSquareOut, GameController, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { TiltCard } from '../animations/TiltCard'

export function Projects() {
  const { t } = useLanguage()
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      setCurrentImageIndex(0)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

  const durumImages = [1, 2, 3, 4, 5, 6, 7].map(num => `/projects/durum-zamani/${num}.jpg`)

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % durumImages.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + durumImages.length) % durumImages.length)

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
              data-lenis-prevent="true" 
              className="w-full max-w-6xl h-[90vh] bg-[var(--color-toon-bg)] rounded-xl border-4 border-black flex flex-col overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 bg-[var(--color-toon-orange)] border-b-4 border-black flex justify-between items-center z-10 shrink-0">
                <h3 className="font-display text-white text-xl uppercase tracking-wider">{selectedProject.name} - {t.projects.actionReview || 'İncele'}</h3>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="toon-button bg-white text-black hover:bg-slate-200 px-4 py-2 text-sm shadow-none"
                >
                  {t.projects.gddClose || 'Kapat'}
                </button>
              </div>
              
              <div className="w-full flex-grow bg-slate-900 flex items-center justify-center p-4 md:p-8 overflow-y-auto relative">
                {selectedProject.id === 'sumakli' ? (
                  <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto">
                    <div className="relative w-full flex-grow flex items-center justify-center rounded-xl border-4 border-black overflow-hidden bg-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImageIndex}
                          src={durumImages[currentImageIndex]}
                          alt={`Dürüm Zamanı In-Game Screenshot ${currentImageIndex + 1}`}
                          className="absolute inset-0 w-full h-full object-contain"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        />
                      </AnimatePresence>
                      
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 rounded-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-[-50%] hover:scale-110 transition-transform z-10"
                      >
                        <CaretLeft weight="bold" className="w-6 h-6" />
                      </button>
                      
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-3 rounded-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-[-50%] hover:scale-110 transition-transform z-10"
                      >
                        <CaretRight weight="bold" className="w-6 h-6" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white font-mono px-3 py-1 rounded-full text-sm font-bold border-2 border-black">
                        {currentImageIndex + 1} / {durumImages.length}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center max-w-2xl bg-white p-12 border-4 border-black rounded-xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] m-auto">
                    <div className="text-7xl mb-6">🚧</div>
                    <h2 className="font-display text-4xl text-black uppercase tracking-wider mb-4">Coming Soon</h2>
                    <p className="text-slate-600 font-sans text-xl">
                      Yakında buraya projenin oyun içi görselleri ve detayları eklenecek.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
