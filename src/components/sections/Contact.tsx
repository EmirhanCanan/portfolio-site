import { useLanguage } from '../../i18n/LanguageContext'
import { Section } from '../layout/Section'
import { EnvelopeSimple, LinkedinLogo, GithubLogo, Phone } from '@phosphor-icons/react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { DraggableCard } from '../animations/DraggableCard'
import { translations } from '../../i18n/translations'

export function Contact() {
  const { t } = useLanguage()

  const handleConfetti = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#3b82f6', '#f97316', '#ffffff', '#fbbf24']
    });
  };

  return (
    <Section id="contact" title={t.contact.title}>
      <DraggableCard>
        <div className="toon-card p-10 md:p-16 text-center max-w-4xl mx-auto bg-gradient-to-b from-[var(--color-toon-card)] to-[var(--color-toon-bg)]">
        <h3 className="text-4xl md:text-5xl font-display text-white uppercase tracking-wider mb-6 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          {t.contact.body}
        </h3>
        
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 font-sans font-medium">
          {t === translations.tr ? 'Hemen iletişime geçin veya projelerimi incelemek için profilime göz atın.' : 'Reach out to me directly or check out my profiles.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
          <motion.a 
            whileHover={{ rotate: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.4, ease: "linear" } }}
            href={`mailto:${t.contact.email}`}
            className="toon-button flex items-center justify-center gap-2 text-lg px-2 py-4 bg-[var(--color-toon-orange)] hover:bg-[var(--color-toon-blue)] w-full h-full"
          >
            <EnvelopeSimple weight="bold" className="w-6 h-6 flex-shrink-0" />
            <span className="truncate">{t.contact.emailCta}</span>
          </motion.a>

          <motion.a 
            whileHover={{ rotate: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.4, ease: "linear" } }}
            href={t.contact.whatsappUrl}
            target="_blank" 
            rel="noreferrer"
            className="toon-button flex items-center justify-center gap-2 text-lg px-2 py-4 bg-green-600 hover:bg-green-700 text-white w-full h-full"
          >
            <Phone weight="bold" className="w-6 h-6 flex-shrink-0" />
            <span className="truncate">{t.contact.phoneCta}</span>
          </motion.a>
          
          <motion.a 
            whileHover={{ rotate: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.4, ease: "linear" } }}
            href="https://github.com/EmirhanCanan"
            target="_blank" 
            rel="noreferrer"
            onClick={handleConfetti}
            className="toon-button flex items-center justify-center gap-2 text-lg px-2 py-4 bg-slate-800 text-white hover:bg-slate-700 w-full h-full"
            title="GitHub"
          >
            <GithubLogo weight="fill" className="w-6 h-6 flex-shrink-0" />
            <span className="truncate">GitHub</span>
          </motion.a>

          <motion.a 
            whileHover={{ rotate: [-4, 4, -4], transition: { repeat: Infinity, duration: 0.4, ease: "linear" } }}
            href={t.contact.linkedinUrl} 
            target="_blank" 
            rel="noreferrer"
            onClick={handleConfetti}
            className="toon-button flex items-center justify-center gap-2 text-lg px-2 py-4 bg-white text-black hover:bg-slate-200 w-full h-full"
            title="LinkedIn"
          >
            <LinkedinLogo weight="fill" className="w-6 h-6 flex-shrink-0" />
            <span className="truncate">LinkedIn</span>
          </motion.a>
        </div>
        </div>
      </DraggableCard>
    </Section>
  )
}
