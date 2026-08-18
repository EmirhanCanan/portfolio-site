import { motion } from 'framer-motion'
import React from 'react'

export function FreeDraggableCard({ children, className = '', constraintsRef }: { children: React.ReactNode, className?: string, constraintsRef?: React.RefObject<any> }) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef || false}
      dragElastic={0.8}
      whileDrag={{ scale: 1.05, zIndex: 50, rotate: Math.random() * 4 - 2 }}
      className={`cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </motion.div>
  )
}
