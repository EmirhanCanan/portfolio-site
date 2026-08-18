import { useEffect } from 'react'
import Lenis from 'lenis'
import { LanguageProvider } from './i18n/LanguageContext'

import { Navbar } from './components/layout/Navbar'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Skills } from './components/sections/Skills'
import { Experience } from './components/sections/Experience'
import { Projects } from './components/sections/Projects'
import { RiotEvents } from './components/sections/RiotEvents'
import { Contact } from './components/sections/Contact'
import ClickSpark from './components/animations/ClickSpark'
import { MiniCharacter } from './components/animations/MiniCharacter'

import './styles/components.css'

function AppContent() {
  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <RiotEvents />
        <Contact />
      </main>
      <MiniCharacter />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <ClickSpark sparkColor="#f97316" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
        <div className="min-h-screen">
          <AppContent />
        </div>
      </ClickSpark>
    </LanguageProvider>
  )
}
