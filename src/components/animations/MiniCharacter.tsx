import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

const EASTER_EGGS = [
  'hack', 'konami', 'whoami', 'pwd', 'sudo make me a sandwich', 
  'nyan', 'valorant', 'riot', 'senpmai', 'do a barrel roll', 
  'yuca', 'matrix', 'ping', 'coffee', 'neofetch', 'hesoyam', 'icardi'
];

export function MiniCharacter() {
  const [clickCount, setClickCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [randomCmd, setRandomCmd] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const { lang } = useLanguage();

  const trContent = {
    click1: "Ne var ?",
    click2: "Ne istiyosun ?",
    responses: [
      "Şu terminal kodunu al ve beni rahat bırak:",
      "Beğenmedin mi? Al bunu dene:",
      "Bütün gün bana mı tıklayacaksın? Al şunu yaz:",
      "Gizli komut mu arıyorsun? Al bakalım:",
      "Bunu kimseye söyleme, sadece sana özel:",
    ]
  };

  const enContent = {
    click1: "What?",
    click2: "What do you want?",
    responses: [
      "Take this terminal code and leave me alone:",
      "Didn't like it? Try this one:",
      "Are you going to click me all day? Type this:",
      "Looking for a secret command? Here you go:",
      "Don't tell anyone, this is just for you:",
    ]
  };

  const content = lang === 'en' ? enContent : trContent;

  // The index of "Beğenmedin mi? / Didn't like it?" is 1
  const BANNED_FIRST_RESPONSE_INDEX = 1;

  useEffect(() => {
    if (clickCount >= 3) {
      // Pick command sequentially based on click count
      const cmdIndex = (clickCount - 3) % EASTER_EGGS.length;
      setRandomCmd(EASTER_EGGS[cmdIndex]);

      let newRes = responseMsg;
      let newResIndex = -1;
      
      // Ensure the new response is different from the last one
      // And if it's the very first time we give a command (clickCount === 3), don't give the banned response
      while (newRes === responseMsg || !newRes || (clickCount === 3 && newResIndex === BANNED_FIRST_RESPONSE_INDEX)) {
        newResIndex = Math.floor(Math.random() * content.responses.length);
        newRes = content.responses[newResIndex];
      }
      setResponseMsg(newRes);
    }
  }, [clickCount, lang]); // Added lang to deps so it translates immediately if changed
  
  const getMessage = () => {
    if (clickCount === 1) return content.click1;
    if (clickCount === 2) return content.click2;
    
    return (
      <span>
        {responseMsg} <br/>
        <code className="text-toon-orange bg-black/50 px-1 py-0.5 rounded mt-2 inline-block font-bold">
          {randomCmd}
        </code>
      </span>
    );
  };

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setClickCount(1);
    } else {
      setClickCount(c => c + 1);
    }
  };

  return (
    <div className="absolute bottom-0 right-0 md:right-4 z-[100] flex items-end pointer-events-none w-48 h-48 sm:w-64 sm:h-64">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            className="absolute bottom-[90%] right-[60%] bg-toon-card border-2 border-slate-700 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-2xl rounded-br-none p-3 mb-2 min-w-[220px] pointer-events-auto z-10"
          >
            <p className="text-white font-mono text-sm leading-relaxed">
              {getMessage()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Clipped container to prevent page stretching when character is moved down */}
      <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden rounded-tl-3xl pointer-events-none">
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] cursor-pointer pointer-events-auto"
          onClick={handleClick}
          animate={isOpen ? { y: "-10%", x: "-15%", scale: 1.1, rotate: -5 } : { y: "45%", x: "25%", scale: 0.95, rotate: -15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={!isOpen ? { y: "35%", x: "15%" } : { scale: 1.15 }}
        >
          <img 
            src="/images/mini-character.png" 
            alt="Senpmai" 
            className="w-32 md:w-48 h-auto object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] origin-bottom-right"
          />
        </motion.div>
      </div>
    </div>
  );
}
