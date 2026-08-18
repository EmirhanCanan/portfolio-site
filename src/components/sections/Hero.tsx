import { useLanguage } from '../../i18n/LanguageContext'
import { motion } from 'framer-motion'
import { ArrowRight, Code, DownloadSimple } from '@phosphor-icons/react'
import { TetrisGame } from '../game/TetrisGame'
import { EasterEggName } from '../animations/EasterEggName'

export function Hero() {
  const { t } = useLanguage()

  return (
    <div id="home" className="min-h-[100dvh] flex items-center justify-center pt-20 pb-12 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--color-toon-orange)]/10 border-2 border-[var(--color-toon-orange)] rounded shadow-[4px_4px_0_0_rgba(249,115,22,0.3)]">
            <Code weight="bold" className="text-[var(--color-toon-orange)] w-6 h-6" />
            <span className="font-mono text-[var(--color-toon-orange)] font-bold uppercase tracking-widest">{t.hero.role}</span>
          </div>
          
          <EasterEggName />
          
          <p className="text-xl md:text-2xl text-slate-300 font-sans max-w-lg font-medium leading-relaxed bg-[var(--color-toon-card)]/50 p-4 border-l-4 border-[var(--color-toon-blue)]">
            {t.hero.linePrimary}. <br/>
            <span className="text-[var(--color-toon-orange)]">{t.hero.lineSecondary}.</span>
          </p>

          <div className="text-white font-mono font-bold text-lg md:text-xl mt-2">
            {t.hero.hint}
          </div>
          
          <div className="flex flex-col gap-4 pt-8">
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="toon-button">
                {t.hero.ctaWork} <ArrowRight weight="bold" />
              </a>
              <a href="#contact" className="toon-button bg-white text-black hover:bg-slate-200">
                {t.hero.ctaContact}
              </a>
            </div>
            <div className="flex">
              <a 
                href={t.hero.resumeUrl} 
                download
                className="toon-button bg-transparent border-2 border-[var(--color-toon-blue)] text-slate-200 hover:bg-[var(--color-toon-blue)] hover:text-white transition-colors flex items-center gap-2 w-max"
              >
                {t.hero.ctaResume} <DownloadSimple weight="bold" />
              </a>
            </div>
          </div>
        </motion.div>
        
        {/* Interactive Playable Game */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex justify-center w-full"
        >
          <TetrisGame />
        </motion.div>
      </div>
    </div>
  )
}
