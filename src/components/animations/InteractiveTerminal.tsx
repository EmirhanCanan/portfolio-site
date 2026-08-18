import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { motion } from 'framer-motion';

type HistoryItem = {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
  prompt?: string;
};

const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.01 }
  }
};

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

function AnimatedText({ text }: { text: string }) {
  return (
    <motion.p 
      className="mt-2 mb-2 leading-relaxed text-slate-300"
      variants={textVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={charVariants}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

function TypingEffect({ lines }: { lines: { text: string; className: string }[] }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const text = lines[currentLine].text;

    if (currentChar < text.length) {
      const timer = setTimeout(() => {
        setCurrentChar(c => c + 1);
      }, 30); // 30ms per character
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 800); // 800ms delay between lines
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, lines]);

  return (
    <div className="flex flex-col mt-2 mb-2 font-mono">
      {lines.slice(0, currentLine).map((line, i) => (
        <span key={i} className={line.className}>{line.text}</span>
      ))}
      {currentLine < lines.length && (
        <span className={lines[currentLine].className}>
          {lines[currentLine].text.slice(0, currentChar)}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            █
          </motion.span>
        </span>
      )}
    </div>
  );
}

export function InteractiveTerminal() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [inputMode, setInputMode] = useState<'normal' | 'awaiting_name' | 'awaiting_email' | 'awaiting_message'>('normal');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      type: 'system',
      content: "Welcome to Emirhan Canan's Portfolio Terminal v1.0",
    },
    {
      id: 'init-2',
      type: 'system',
      content: "Type 'help' for available commands. Try 'send message' to contact me!",
    },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const getPromptString = () => {
    switch (inputMode) {
      case 'awaiting_name': return 'name = ';
      case 'awaiting_email': return 'email = ';
      case 'awaiting_message': return 'message = ';
      default: return '$ emirhan ~ ';
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (trimmedCmd === '') return;

    const currentPrompt = getPromptString();

    if (inputMode === 'awaiting_name') {
      setFormData(prev => ({ ...prev, name: trimmedCmd }));
      setHistory(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'command', content: cmd, prompt: currentPrompt },
        { id: Date.now().toString() + '-out', type: 'system', content: 'Enter your email address:' }
      ]);
      setInputMode('awaiting_email');
      return;
    }

    if (inputMode === 'awaiting_email') {
      setFormData(prev => ({ ...prev, email: trimmedCmd }));
      setHistory(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'command', content: cmd, prompt: currentPrompt },
        { id: Date.now().toString() + '-out', type: 'system', content: 'Type your message:' }
      ]);
      setInputMode('awaiting_message');
      return;
    }

    if (inputMode === 'awaiting_message') {
      const accessKey = "4c695879-7573-4800-92e9-46c3b84b7784";

      if (!accessKey) {
        setHistory(prev => [
          ...prev,
          { id: Date.now().toString(), type: 'command', content: cmd, prompt: currentPrompt },
          { id: Date.now().toString() + '-error', type: 'error', content: 'Message system not configured (Missing VITE_WEB3FORMS_KEY in .env). Please contact me via email directly.' }
        ]);
        setInputMode('normal');
        setFormData({ name: '', email: '', message: '' });
        return;
      }

      setHistory(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'command', content: cmd, prompt: currentPrompt },
        { id: Date.now().toString() + '-out', type: 'system', content: 'Sending message securely to the server...' }
      ]);

      const payload = {
        access_key: accessKey,
        name: formData.name,
        email: formData.email,
        message: trimmedCmd,
        subject: `New message from ${formData.name} (Terminal Portfolio)`,
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(async (response) => {
        if (response.status === 200) {
          setHistory(prev => [...prev, {
            id: Date.now().toString() + '-success',
            type: 'system',
            content: 'Your message has reached me, I will get back to you soon!'
          }]);
          
          import('canvas-confetti').then((confetti) => {
            confetti.default({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#3b82f6', '#f97316', '#ffffff', '#fbbf24']
            });
          });
        } else {
          setHistory(prev => [...prev, {
            id: Date.now().toString() + '-error',
            type: 'error',
            content: 'Failed to send message via server API. Please use the contact section.'
          }]);
        }
      })
      .catch(() => {
        setHistory(prev => [...prev, {
          id: Date.now().toString() + '-error',
          type: 'error',
          content: 'Network error occurred. The message could not be sent.'
        }]);
      });

      setInputMode('normal');
      setFormData({ name: '', email: '', message: '' });
      return;
    }

    const lowerCmd = trimmedCmd.toLowerCase();

    const newHistory: HistoryItem[] = [
      ...history,
      { id: Date.now().toString(), type: 'command', content: cmd, prompt: currentPrompt },
    ];

    switch (lowerCmd) {
      case 'help':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="flex flex-col gap-1 mt-2 mb-2">
              <div><span className="text-toon-blue font-bold w-32 inline-block">help</span> - Show this help menu</div>
              <div><span className="text-toon-blue font-bold w-32 inline-block">info</span> - Display 'About Me' information</div>
              <div><span className="text-toon-blue font-bold w-32 inline-block">skills</span> - List technical and soft skills</div>
              <div><span className="text-toon-blue font-bold w-32 inline-block">contact</span> - Show contact information</div>
              <div><span className="text-toon-blue font-bold w-32 inline-block">send message</span> - Send me an email directly!</div>
              <div><span className="text-toon-blue font-bold w-32 inline-block">clear</span> - Clear the terminal screen</div>
            </div>
          ),
        });
        break;
      case 'info':
      case 'about':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: <AnimatedText text={t.about.body} />,
        });
        break;
      case 'skills':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="mt-2 mb-2">
              <p className="text-toon-orange font-bold mb-1">{t.skills.technicalTitle}:</p>
              <p className="text-slate-300 mb-2">{t.skills.technical.map(s => s.label).join(' • ')}</p>
              
              <p className="text-toon-orange font-bold mb-1">{t.skills.softTitle}:</p>
              <p className="text-slate-300">{t.skills.soft.join(' • ')}</p>
            </div>
          ),
        });
        break;
      case 'contact':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="flex flex-col gap-1 mt-2 mb-2">
              <div><span className="text-slate-400">Email:</span> <a href={`mailto:${t.contact.email}`} className="text-toon-blue hover:underline">{t.contact.email}</a></div>
              <div><span className="text-slate-400">WhatsApp:</span> <a href={t.contact.whatsappUrl} target="_blank" rel="noreferrer" className="text-toon-blue hover:underline">+90 553 756 9929</a></div>
              <div><span className="text-slate-400">GitHub:</span> <a href="https://github.com/EmirhanCanan" target="_blank" rel="noreferrer" className="text-toon-blue hover:underline">github.com/EmirhanCanan</a></div>
              <div><span className="text-slate-400">LinkedIn:</span> <a href={t.contact.linkedinUrl} target="_blank" rel="noreferrer" className="text-toon-blue hover:underline">linkedin.com/in/emirhan-canan</a></div>
              <div className="text-green-400 mt-2 font-bold">💡 Tip: Type 'send message' to send an email right from here!</div>
            </div>
          ),
        });
        break;
      case 'send message':
      case 'message':
      case 'mail':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'system',
          content: 'Let\'s send a message! Please enter your name:'
        });
        setInputMode('awaiting_name');
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'sudo':
        newHistory.push({
          id: Date.now().toString() + '-error',
          type: 'error',
          content: 'Nice try! You do not have root privileges here.',
        });
        break;
      case 'yuca':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-red-500 font-bold animate-pulse mt-2 mb-2">
              [WARNING] Anomaly detected... Don't look behind you.
            </div>
          ),
        });
        break;
      case 'matrix':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-green-500 font-mono mt-2 mb-2">
              Wake up, Emirhan...<br/>
              The Matrix has you...<br/>
              Follow the white rabbit.
            </div>
          ),
        });
        break;
      case 'riot':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'system',
          content: 'Connecting to Riot servers... Match found! Lock in your agent.',
        });
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4655', '#111111', '#ffffff']
          });
        });
        break;
      case 'valorant':
      case 'valo':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'system',
          content: 'Instalocking Jett for Senpmai... 1v5 clutch engaged. Watch them run!',
        });
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0f1923', '#ff4655', '#ffffff']
          });
        });
        break;
      case 'senpmai':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <TypingEffect 
              lines={[
                { text: "Authenticating user 'Senpmai'...", className: 'text-toon-blue' },
                { text: "Identity confirmed: The Mastermind.", className: 'text-toon-orange font-bold' },
                { text: "Unlocking developer God Mode...", className: 'text-green-400' },
                { text: "Welcome back, Boss.", className: 'text-white font-bold mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' },
              ]} 
            />
          ),
        });
        break;
      case 'ls':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="flex gap-4 text-toon-blue mt-2 mb-2 font-bold flex-wrap">
              <span>projects/</span>
              <span>games/</span>
              <span>esports/</span>
              <span>secret_plans/</span>
              <span className="text-green-400">resume.pdf</span>
            </div>
          ),
        });
        break;
      case 'cat':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-orange-400 font-mono text-sm sm:text-base mt-2 mb-2 leading-tight">
              <pre className="inline-block">
{` /\\_/\\ 
( o.o )
 > ^ < `}
              </pre>
            </div>
          ),
        });
        break;
      case '404':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'error',
          content: 'Error 404: Sleep not found. Developer is fueled by coffee.',
        });
        break;
      case 'do a barrel roll':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'system',
          content: 'Executing barrel roll...',
        });
        document.body.style.transition = 'transform 2s ease-in-out';
        document.body.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          document.body.style.transition = 'none';
          document.body.style.transform = 'none';
          setTimeout(() => {
            document.body.style.transition = '';
          }, 50);
        }, 2000);
        break;
      case 'sudo rm -rf /':
      case 'rm -rf /':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-red-500 font-mono mt-2 mb-2 flex flex-col">
              <span>Deleting /usr/bin...</span>
              <span>Deleting /home/emirhan...</span>
              <span>Deleting /var/log...</span>
              <span className="mt-2 text-green-400 font-bold">Just kidding, this portfolio is indestructible! 😎</span>
            </div>
          ),
        });
        break;
      case 'esma':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-red-500 font-mono text-[10px] sm:text-xs mt-2 mb-2 leading-[1.1] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              <pre className="inline-block">
{`⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠤⢥⠤⠀⠀⠀⠀⠀⠀⠀⢀⣠⡞⠳⣄⠀⠀⠀⠀⠀⠀⢀⢤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠘⠀⠀⠀⠀⠀⠀⠤⣶⣛⠉⠀⠀⢈⡳⠖⠀⠀⠀⠀⠘⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠤⠤⠀⣧⠇⠀⠐⠦⢤⣀⠀⠀⠀⠀⢀⣤⠖⠒⠛⠛⠓⠂⠀⠶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⡶⠋⢀⡀⠀⠀⢻⠀⠀⠀⠤⡀⠈⠳⣄⣀⡴⠋⢀⠔⠈⠉⢉⣱⠀⢀⠤⡄⠈⠳⣤⠠⠤⠦⢤⡀⠀
⠀⠀⠀⠀⠀⣰⠋⢀⡔⠁⣸⠀⠀⠈⠀⠀⠀⠀⠘⢂⠀⠘⠋⠀⠐⠇⠰⠂⠉⠁⠀⠀⠈⠉⠀⠀⢠⠘⣧⠀⠀⠀⢻⡆
⠀⠀⠀⠀⠀⡟⠀⡼⠀⢠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡆⢸⡄⠀⠀⣼⠇
⠀⠀⠀⠀⠸⡇⠀⠣⣀⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠄⣸⠀⢀⣼⠋⠀
⠀⠀⠀⠀⠀⣷⠀⢀⡄⢢⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⢀⣯⡾⠛⠀⠀⠀
⠀⠀⠀⠀⠀⠹⣷⠀⠑⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⢀⣠⢷⡟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡇⠀⠹⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⢱⡀⠀⠀⠉⢰⡏⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠉⠁⠆⠉⠀⢙⣷⣄⠰⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠶⣚⠁⠀⢙⡶⢃⡴⠋⠀⢀⠀⠀⠀⠀⠀⠀
⠀⣠⠄⠀⠀⢀⣴⠋⠀⠙⢦⡙⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⠀⠀⠀⠀⠈⠳⡀⡜⡠⠊⠀⠀⣀⡘⣁⣀⠀⠀⠀⠀
⠀⠐⠁⠀⢀⡏⡏⠀⠀⠀⠀⠙⠶⣌⠓⠄⣀⠀⠀⠀⠀⡀⠼⣀⣀⠀⠀⠀⠀⠀⣷⠁⠀⠀⠀⠀⠀⠸⠇⠀⠀⠀⠀⠀
⠸⣁⡇⠀⠸⡇⠣⣀⠀⠀⠀⠀⠀⠈⠻⣦⣉⣄⡤⠔⠂⠀⠸⠀⠀⠀⠀⢀⡴⠒⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠙⠶⢤⣭⣴⣦⣶⡾⠾⠟⠛⠙⢷⣄⡀⠀⠀⠀⠀⢀⡤⠞⠉⠀⠀⠀⢀⣠⣎⡁⢲⡄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡒⡂⠀⠈⠛⠲⣄⡴⠞⠁⠀⠀⠀⠀⠀⠀⠨⡌⢪⡿⠚⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠉⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠰⣉⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
              </pre>
            </div>
          ),
        });
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ef4444', '#f87171', '#fca5a5'],
            zIndex: 9999
          });
        });
        break;
      case 'whoami':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: <span className="text-toon-blue">emirhan_canan (Founder - Lapis Interactive) - Root privileges active.</span>,
        });
        break;
      case 'pwd':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: <span className="text-toon-orange">/home/emirhan/lapis-interactive/secret-base</span>,
        });
        break;
      case 'sudo make me a sandwich':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'error',
          content: 'I am not your servant. Go make it yourself!',
        });
        break;
      case 'konami':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'system',
          content: 'Konami code activated! Toggling reality...',
        });
        if (document.documentElement.style.filter) {
          document.documentElement.style.filter = '';
        } else {
          document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
        }
        break;
      case 'hack':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <TypingEffect 
              lines={[
                { text: 'Establishing secure connection...', className: 'text-green-500' },
                { text: 'Bypassing mainframe firewall...', className: 'text-green-500' },
                { text: 'Decrypting Riot Games database...', className: 'text-green-500' },
                { text: 'Target: Vanguard Anti-Cheat', className: 'text-green-500' },
                { text: 'Injecting payloads: [||||||||||] 100%', className: 'text-green-500' },
                { text: 'ACCESS GRANTED. Welcome to the Matrix.', className: 'text-red-500 font-bold mt-2 animate-pulse' },
              ]} 
            />
          ),
        });
        break;
      case 'nyan':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-pink-400 font-mono text-sm sm:text-base mt-2 mb-2 leading-tight drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">
              <pre className="inline-block animate-pulse">
{`★      ★         ★       ★
  ★        ★        ★ 
- - - - - - ,------,
- - - - - - |   /\\_/\\
- - - - - -~|__( ^ .^)
- - - - - - ""  ""
★       ★         ★      ★`}
              </pre>
            </div>
          ),
        });
        break;
      case 'ping':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: 'Pong! 🏓 (Latency: 2ms - Too slow, Senpmai is faster.)',
        });
        break;
      case 'coffee':
      case 'kahve':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="text-[#d97706] font-mono text-xs sm:text-sm mt-2 mb-2 leading-tight">
              <pre className="inline-block">
{`    (  )   (   )  )
     ) (   )  (  (
     ( )  (    ) )
     _____________
    <_____________> ___
    |             |/ _ \\
    |               | | |
    |               |_| |
 ___|             |\\___/
/    \\___________/    \\
\\_____________________/`}
              </pre>
              <div className="mt-2 text-white font-bold">Brewing virtual coffee... Enjoy! ☕</div>
            </div>
          ),
        });
        break;
      case 'neofetch':
      case 'fetch':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2 mb-2 text-slate-300 font-mono text-xs sm:text-sm">
              <pre className="text-toon-blue font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
{`       _
      / \\
     /   \\
    /     \\
   /_______\\
  /         \\
 /           \\`}
              </pre>
              <div className="flex flex-col gap-1 border-l-2 border-slate-600 pl-4">
                <div><span className="text-toon-orange font-bold">OS:</span> SenpmaiOS (Lapis Edition)</div>
                <div><span className="text-toon-orange font-bold">Host:</span> Emirhan Canan</div>
                <div><span className="text-toon-orange font-bold">Uptime:</span> 20+ years of gaming</div>
                <div><span className="text-toon-orange font-bold">Packages:</span> Unreal, Unity, React, Typescript</div>
                <div><span className="text-toon-orange font-bold">Shell:</span> zsh (Senpmai Mod)</div>
                <div><span className="text-toon-orange font-bold">CPU:</span> Brain (Overclocked via Caffeine)</div>
                <div><span className="text-toon-orange font-bold">Memory:</span> 100% focused on esports</div>
              </div>
            </div>
          ),
        });
        break;
      case 'hesoyam':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: <span className="text-green-400 font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Health, Armor, $250k added!</span>,
        });
        break;
      case 'icardi':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content: (
            <TypingEffect 
              lines={[
                { text: "Dört yıl önce, hayatın beni yaşayacağım en güzel hikayelerden birine götürdüğünü bilmeden geldim.", className: 'text-[#facc15]' },
                { text: "Bugün anlıyorum ki bu sadece futbol değildi.", className: 'text-[#facc15]' },
                { text: "Asla sadece futbol olmadı.", className: 'text-[#ef4444] font-bold' },
                { text: "Çünkü stadyumun gürültüsü, İstanbul'un ışıkları, tribünlerden inen tezahüratlar ve milyonlarca insanın sevgisi arasında…", className: 'text-[#facc15]' },
                { text: "farkında bile olmadan, evimden uzakta yeni bir ev buldum.", className: 'text-[#ef4444]' },
                { text: "Dört yıl geçti. Dört şampiyonluk. Binlerce sarılma. Milyonlarca anı.", className: 'text-[#facc15]' },
                { text: "Ama en değerlisi kupalar değildi.", className: 'text-[#ef4444]' },
                { text: "Bütün bir ülkenin bana kalbini açtığını ve içimin en derinlerine işlediğini hissetmekti.", className: 'text-[#facc15]' },
                { text: "Çünkü insanın içinde sonsuza dek yaşayan yerler vardır.", className: 'text-[#ef4444]' },
                { text: "Türkiye benim için böyle olacak. Silinmesi imkansız bir hatıra. Zamanın asla dokunamayacağı bir aşk.", className: 'text-[#facc15]' },
                { text: "Çünkü dünyanın doksan dakikalığına durduğu geceler oldu.", className: 'text-[#ef4444]' },
                { text: "Ve o anlarda, tüm stadyum tek yürek şarkı söylerken, futboldan çok daha öte bir şey yaşadığımı anlıyordum.", className: 'text-[#facc15]' },
                { text: "Çocukların gözlerindeki mutluluğu gördüm.", className: 'text-[#ef4444]' },
                { text: "Beni sanki hayatım boyunca tanıyormuş gibi kucaklayan insanların gözyaşlarını gördüm.", className: 'text-[#facc15]' },
                { text: "Ve öylesine devasa bir sevgi hissettim ki… bazen bunu kelimeler bile açıklayamaz.", className: 'text-[#ef4444]' },
                { text: "Teşekkürler Galatasaray.", className: 'text-[#facc15] font-bold' },
                { text: "Beni bu hikayenin bir parçası yaptığın için teşekkürler.", className: 'text-[#ef4444]' },
                { text: "Bana sevildiğimi, saygı duyulduğumu ve sonsuz olduğumu hissettirdiğin için teşekkürler.", className: 'text-[#facc15]' },
                { text: "Belki bir gün ışıklar sönecek, maçlar bitecek ve zaman akıp geçecek.", className: 'text-[#ef4444]' },
                { text: "Ama bazı aşklar veda nedir bilmez.", className: 'text-[#facc15] font-bold' },
                { text: "Ve yıllar geçtiğinde geriye dönüp bakacağım ve kalbim dopdolu bir şekilde gülümseyeceğim;", className: 'text-[#ef4444]' },
                { text: "çünkü harika bir ülkede, bir zamanlar gerçekten mutlu olduğumu bileceğim.", className: 'text-[#facc15]' },
                { text: "🏆🏆🏆🏆", className: 'text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' },
              ]} 
            />
          ),
        });
        break;
      case 'clear':
        setHistory([]);
        return; // Early return to not add the clear command itself
      case 'sudo reboot':
      case 'reboot':
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'system',
          content: 'Initiating system reboot...',
        });
        setHistory(newHistory);
        setTimeout(() => {
          setHistory([]);
          setTimeout(() => {
            setHistory([
              { id: 'boot-1', type: 'system', content: 'System rebooted successfully.' },
              { id: 'boot-2', type: 'system', content: 'Welcome back, Senpmai.' }
            ]);
          }, 1000);
        }, 800);
        return; // early return
      default:
        if (lowerCmd.startsWith('sudo rm -rf') || lowerCmd.startsWith('rm -rf')) {
          newHistory.push({
            id: Date.now().toString() + '-out',
            type: 'output',
            content: (
              <TypingEffect 
                lines={[
                  { text: 'Deleting /usr/bin...', className: 'text-red-500' },
                  { text: 'Deleting /home/emirhan...', className: 'text-red-500' },
                  { text: 'Deleting /var/log...', className: 'text-red-500' },
                  { text: 'Just kidding, this portfolio is indestructible!', className: 'text-green-400 font-bold mt-2' },
                ]} 
              />
            ),
          });
        } else if (lowerCmd.startsWith('sudo')) {
          newHistory.push({
            id: Date.now().toString() + '-error',
            type: 'error',
            content: 'Nice try! You do not have root privileges here.',
          });
        } else {
          newHistory.push({
            id: Date.now().toString() + '-error',
            type: 'error',
            content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.`,
          });
        }
    }

    setHistory(newHistory);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div 
      className="w-full h-full min-h-[400px] flex flex-col bg-[#0f172a] rounded-xl border-2 border-slate-700 shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden font-mono text-sm sm:text-base"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header (macOS style) */}
      <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-2 border-b-2 border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-slate-400 text-xs font-mono">emirhan@portfolio:~</div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={containerRef}
        className="p-4 sm:p-6 flex-grow overflow-y-auto max-h-[500px] flex flex-col scroll-smooth overscroll-contain cursor-grab"
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col min-h-full cursor-text w-full pb-8" onClick={() => inputRef.current?.focus()}>
          {history.map((item) => (
            <div key={item.id} className="mb-1">
              {item.type === 'system' && (
                <div className="text-green-400 mb-1">{item.content}</div>
              )}
              {item.type === 'command' && (
                <div className="flex gap-2 text-white">
                  <span className="text-toon-blue font-bold whitespace-nowrap">{item.prompt || '$ emirhan ~'}</span>
                  <span>{item.content}</span>
                </div>
              )}
              {item.type === 'output' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-slate-300 ml-4"
                >
                  {item.content}
                </motion.div>
              )}
              {item.type === 'error' && (
                <div className="text-red-400 ml-4">bash: {item.content}</div>
              )}
            </div>
          ))}

          {/* Input Line */}
          <form onSubmit={onSubmit} className="flex gap-2 text-white mt-4 mb-4 items-center">
            <span className="text-toon-blue font-bold whitespace-nowrap">{getPromptString()}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-transparent outline-none text-white font-mono cursor-text"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
