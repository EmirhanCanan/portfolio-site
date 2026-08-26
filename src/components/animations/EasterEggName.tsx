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
      className="text-6xl md:text-[7rem] font-display uppercase leading-[0.9] cursor-pointer select-none"
      style={{ textShadow: '6px 6px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
    >
      <div className="inline-block text-white">
        {name1.map((char, i) => (
          <motion.span
            key={"first-"+i}
            custom={i}
            animate={controls}
            initial={{ y: 0 }}
            whileInView={{
              y: [-2, 2, -2],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }
            }}
            whileHover={{ scale: 1.25, y: -10, rotate: Math.random() > 0.5 ? 10 : -10, color: "#f97316" }}
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
            initial={{ y: 0 }}
            whileInView={{
              y: [-2, 2, -2],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: (i + name1.length) * 0.1 }
            }}
            whileHover={{ scale: 1.25, y: -10, rotate: Math.random() > 0.5 ? 10 : -10, color: "#3b82f6" }}
            className="inline-block transition-colors duration-200"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </h1>
  );
}
