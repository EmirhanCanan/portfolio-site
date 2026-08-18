import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title?: string
  children: ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="py-24 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        {title && (
          <div className="mb-12 inline-block">
            <h2 className="text-4xl md:text-5xl font-display text-[var(--color-toon-text)] uppercase tracking-wider relative z-10">
              {title}
            </h2>
            <div className="h-4 bg-[var(--color-toon-blue)] w-full -mt-4 opacity-50 relative z-0 mix-blend-screen"></div>
          </div>
        )}
        <div className="text-lg text-slate-300 font-sans">
          {children}
        </div>
      </div>
    </section>
  )
}
