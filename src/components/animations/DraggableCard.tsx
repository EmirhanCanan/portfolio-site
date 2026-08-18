import { motion } from 'framer-motion'
import React from 'react'

export function DraggableCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.02, zIndex: 50, rotate: Math.random() * 2 - 1 }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </motion.div>
  )
}
