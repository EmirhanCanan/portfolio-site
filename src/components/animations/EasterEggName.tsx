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
          controls.set({ y: 0, rotate: 0, opacity: 1 });
        }, 1000);
      });
    }
  }, [clicks, controls]);

  const handleClick = () => {
    if (clicks < 5) {
      setClicks(c => c + 1);
    }
  };

  const name = "> Emirhan_Canan";

  return (
    <div className="flex flex-col items-start select-none cursor-pointer" onClick={handleClick}>
      <motion.h1 
        animate={controls}
        className="text-[4rem] md:text-[6.5rem] font-mono text-[var(--color-toon-orange)] tracking-tighter"
        style={{ textShadow: '4px 4px 0 #000' }}
      >
        {name.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.1,
              delay: index * 0.15,
            }}
          >
            {char}
          </motion.span>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block w-[0.6em] h-[1em] bg-[var(--color-toon-blue)] align-middle ml-2"
          style={{ boxShadow: '4px 4px 0 #000' }}
        />
      </motion.h1>
    </div>
  );
}
