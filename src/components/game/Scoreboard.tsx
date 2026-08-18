import { useState, useEffect } from 'react';
import { Trophy, CaretDown, CaretUp } from '@phosphor-icons/react';

interface Score {
  id: string;
  name: string;
  score: number;
  date: string;
}

interface ScoreboardProps {
  currentScore: number;
  isGameOver: boolean;
  onSave: () => void;
}

const PROFANITY_LIST = [
  'amk', 'aq', 'sik', 'yarrak', 'piç', 'oç', 'orospu', 'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'slut', 'whore', 'fag', 'nigger', 'nigga', 'bastard', 'siktir', 'göt', 'pezevenk', 'babası', 'annesi', 'anası', 'bacısı', 'sülale', 'yarak', 'amcık', 'gavat', 'ibne'
];

function containsProfanity(name: string): boolean {
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(word, 'i');
    return regex.test(name);
  });
}

export function Scoreboard({ currentScore, isGameOver, onSave }: ScoreboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tetris_scores');
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isGameOver) {
      setIsOpen(true);
    }
  }, [isGameOver]);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || currentScore === 0) return;

    if (containsProfanity(playerName.trim())) {
      setIsError(true);
      setPlayerName('Küfür/Argo Yasak!');
      return;
    }

    const safeName = playerName.trim();

    const newScore: Score = {
      id: Date.now().toString(),
      name: safeName.substring(0, 15),
      score: currentScore,
      date: new Date().toLocaleDateString(),
    };

    const updatedScores = [...scores, newScore].sort((a, b) => b.score - a.score).slice(0, 20); // Keep top 20
    setScores(updatedScores);
    localStorage.setItem('tetris_scores', JSON.stringify(updatedScores));
    setPlayerName('');
    setIsError(false);
    onSave();
  };

  const handleInputClick = () => {
    if (isError) {
      setPlayerName('');
      setIsError(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-4">
      <div 
        className="toon-card bg-slate-900 border-2 border-toon-yellow cursor-pointer p-4 flex justify-between items-center transition-all hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 text-toon-yellow">
          <Trophy weight="fill" className="w-6 h-6" />
          <h3 className="font-display text-xl uppercase tracking-widest mt-1">LİDERLİK TABLOSU</h3>
        </div>
        <div className="text-slate-400">
          {isOpen ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
        </div>
      </div>

      {isOpen && (
        <div className="bg-slate-900 border-x-2 border-b-2 border-toon-yellow rounded-b-xl p-6 shadow-xl mt-[-4px] relative z-0">
          {isGameOver && currentScore > 0 && (
            <form onSubmit={handleSaveScore} className="mb-8 p-4 border-2 border-toon-orange bg-toon-orange/10 rounded-lg flex flex-col gap-3">
              <p className="font-mono text-toon-orange font-bold">Skorun: {currentScore}</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => {
                    if (!isError) setPlayerName(e.target.value);
                  }}
                  onClick={handleInputClick}
                  placeholder="İsmini gir..." 
                  maxLength={17}
                  required
                  className={`flex-grow bg-slate-800 border-2 text-white p-2 outline-none rounded font-mono transition-colors ${
                    isError 
                      ? 'border-red-500 bg-red-500/20 text-red-400 animate-pulse' 
                      : 'border-slate-600 focus:border-toon-orange'
                  }`}
                />
                <button type="submit" className="bg-toon-orange text-white font-bold px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                  KAYDET
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {scores.length === 0 ? (
              <p className="text-slate-500 font-mono text-center py-4">Henüz skor kaydedilmedi.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {scores.map((s, idx) => (
                  <div key={s.id} className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold w-6 text-center ${idx === 0 ? 'text-toon-yellow' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-orange-400' : 'text-slate-500'}`}>
                        #{idx + 1}
                      </span>
                      <span className="font-sans text-white font-bold">{s.name}</span>
                    </div>
                    <span className="font-mono text-toon-blue font-bold">{s.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
