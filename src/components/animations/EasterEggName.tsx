import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export function EasterEggName() {
  const [clicks, setClicks] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (clicks === 5) {
      // Trigger fall
      controls.start(i => ({
        y: [0, -20, window.innerHeight + 100],
        rotate: [0, Math.random() * 90 - 45, Math.random() * 360 - 180],
        opacity: [1, 1, 0],
        transition: { duration: 1.5, delay: i * 0.05, ease: "easeIn" }
      })).then(() => {
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

  const name1 = "Emirhan".split("");
  const name2 = "Canan".split("");

  return (
    <h1 
      onClick={handleClick}
      className="text-6xl md:text-8xl font-display text-white uppercase leading-none drop-shadow-[4px_4px_0_rgba(0,0,0,1)] cursor-pointer select-none"
    >
      <div className="inline-block">
        {name1.map((char, i) => (
          <motion.span
            key={"first-"+i}
            custom={i}
            animate={controls}
            whileHover={{ scale: 1.1, color: "var(--color-toon-orange)" }}
            className="inline-block transition-colors duration-200"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <br />
      <div className="inline-block text-[var(--color-toon-blue)]">
        {name2.map((char, i) => (
          <motion.span
            key={"last-"+i}
            custom={i + name1.length}
            animate={controls}
            whileHover={{ scale: 1.1, color: "var(--color-toon-orange)" }}
            className="inline-block transition-colors duration-200"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </h1>
  );
}
