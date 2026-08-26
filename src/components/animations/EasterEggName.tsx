import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function EasterEggName() {
  const [clicks, setClicks] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (clicks === 5) {
      controls.start({
        y: window.innerHeight + 100,
        rotate: Math.random() * 360 - 180,
        opacity: 0,
        transition: { duration: 1.5, ease: "easeIn" }
      }).then(() => {
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

  const shadowBase = "4px 4px 0 rgba(0,0,0,1)";

  return (
    <div className="flex flex-col items-start select-none cursor-pointer group" onClick={handleClick}>
      <motion.h1 
        animate={controls}
        className="text-[5rem] md:text-[8rem] font-display uppercase leading-[0.85] text-white cyber-glitch"
        data-text="Emirhan"
        style={{ textShadow: shadowBase, WebkitTextStroke: '2px black' }}
      >
        Emirhan
      </motion.h1>

      <motion.h1 
        animate={controls}
        className="text-[5rem] md:text-[8rem] font-display uppercase leading-[0.85] text-[var(--color-toon-blue)] cyber-glitch mt-4"
        data-text="Canan"
        style={{ textShadow: shadowBase, WebkitTextStroke: '2px black' }}
      >
        Canan
      </motion.h1>
    </div>
  );
}
