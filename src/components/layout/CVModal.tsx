import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

export function CVModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-cv-modal', handleOpen)
    return () => window.removeEventListener('open-cv-modal', handleOpen)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black/80 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-5xl h-[90vh] bg-[var(--color-toon-bg)] rounded-xl border-4 border-black flex flex-col overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-[var(--color-toon-orange)] border-b-4 border-black flex justify-between items-center">
              <h3 className="font-display text-white text-xl uppercase tracking-wider">{t.nav.cv}</h3>
              <div className="flex gap-4">
                <a 
                  href={t.hero.resumeUrl}
                  download
                  className="toon-button bg-[var(--color-toon-blue)] text-white hover:bg-blue-600 px-4 py-2 text-sm shadow-none"
                >
                  {t.nav.cvTag}
                </a>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="toon-button bg-white text-black hover:bg-slate-200 px-4 py-2 text-sm shadow-none"
                >
                  {t.projects.gddClose || 'Kapat'}
                </button>
              </div>
            </div>
            <div className="w-full flex-grow border-none bg-slate-100 flex flex-col items-center justify-center relative">
              <iframe 
                src={t.hero.resumeUrl} 
                className="absolute inset-0 w-full h-full border-none"
                title="CV Preview"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
