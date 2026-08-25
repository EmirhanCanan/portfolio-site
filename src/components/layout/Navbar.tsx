import { useLanguage } from '../../i18n/LanguageContext'


export function Navbar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="container mx-auto max-w-6xl">
        <nav className="pointer-events-auto bg-[var(--color-toon-card)] border-2 border-black rounded-xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] flex items-center justify-between">
          <a href="#home" className="font-display text-xl text-[var(--color-toon-orange)] hover:text-white transition-colors uppercase tracking-widest">
            Sudo_Emir
          </a>
          
          <ul className="hidden md:flex items-center gap-8 font-sans font-bold text-lg uppercase tracking-wider">
            <li><a href="#about" className="hover:text-[var(--color-toon-blue)] hover:-translate-y-1 transition-all inline-block">{t.nav.about}</a></li>
            <li><a href="#skills" className="hover:text-[var(--color-toon-blue)] hover:-translate-y-1 transition-all inline-block">{t.nav.skills}</a></li>
<li><a href="#experience" className="hover:text-[var(--color-toon-blue)] hover:-translate-y-1 transition-all inline-block">{t.nav.experience}</a></li>
<li><a href="#projects" className="hover:text-[var(--color-toon-blue)] hover:-translate-y-1 transition-all inline-block">{t.nav.projects}</a></li>
            <li><a href="#contact" className="hover:text-[var(--color-toon-blue)] hover:-translate-y-1 transition-all inline-block">{t.nav.contact}</a></li>
          </ul>
          
          <button 
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="px-4 py-2 bg-[var(--color-toon-bg)] border-2 border-black font-mono font-bold text-lg rounded shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
          >
            {lang.toUpperCase()}
          </button>
        </nav>
      </div>
    </header>
  )
}
