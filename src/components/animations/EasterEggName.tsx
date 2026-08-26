import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function EasterEggName() {
  const [clicks, setClicks] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (clicks === 5) {
      // Trigger fall
      controls.start({
        y: window.innerHeight + 100,
        rotate: Math.random() * 360 - 180,
        opacity: 0,
        transition: { duration: 1.5, ease: "easeIn" }
      }).then(() => {
        // Reset after fall
        setTimeout(() => {
          setClicks(0);
          controls.set({ y: 0, rotate: 0, opacity: 0 });
          controls.start({
            opacity: 1,
            transition: { duration: 1 }
          });
        }, 1000);
      });
    }
  }, [clicks, controls]);

  const handleClick = () => {
    if (clicks < 5) {
      setClicks(c => c + 1);
    }
  };

  const shadowBase = "2px 2px 0 #000, 4px 4px 0 #000, 6px 6px 0 #000, 8px 8px 0 #000, 10px 10px 0 #000, 12px 12px 0 #000, 14px 14px 0 #000";
  const shadowHover = "2px 2px 0 #000, 4px 4px 0 #000, 6px 6px 0 #000";
  const shadowTap = "2px 2px 0 #000";

  return (
    <div className="flex flex-col items-start select-none cursor-pointer" onClick={handleClick}>
      <motion.h1 
        animate={controls}
        initial={{ textShadow: shadowBase, y: 0, x: 0 }}
        whileHover={{ 
          textShadow: shadowHover, 
          y: 8, 
          x: 8,
          color: "var(--color-toon-orange)"
        }}
        whileTap={{ 
          textShadow: shadowTap, 
          y: 12, 
          x: 12 
        }}
        className="text-[5rem] md:text-[8rem] font-display uppercase leading-[0.85] text-white transition-colors duration-200"
        style={{ WebkitTextStroke: '3px black' }}
      >
        Emirhan
      </motion.h1>

      <motion.h1 
        animate={controls}
        initial={{ textShadow: shadowBase, y: 0, x: 0 }}
        whileHover={{ 
          textShadow: shadowHover, 
          y: 8, 
          x: 8,
          color: "var(--color-toon-blue)"
        }}
        whileTap={{ 
          textShadow: shadowTap, 
          y: 12, 
          x: 12 
        }}
        className="text-[5rem] md:text-[8rem] font-display uppercase leading-[0.85] text-white transition-colors duration-200 mt-4"
        style={{ WebkitTextStroke: '3px black' }}
      >
        Canan
      </motion.h1>
    </div>
  );
}
