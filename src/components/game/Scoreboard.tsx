import { useState, useEffect, useCallback } from 'react';
import { Trophy, CaretDown, CaretUp, SpinnerGap } from '@phosphor-icons/react';

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
  const [loading, setLoading] = useState(false);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scores');
      const data = await response.json();
      
      let newScores: Score[] = [];
      const entries = data?.dreamlo?.leaderboard?.entry;
      
      if (entries) {
        if (Array.isArray(entries)) {
          newScores = entries.map((e: any, idx: number) => ({
            id: `dreamlo-${idx}`,
            name: e.name.replace(/_/g, ' '),
            score: parseInt(e.score),
            date: e.date
          }));
        } else {
          newScores = [{
            id: 'dreamlo-0',
            name: entries.name.replace(/_/g, ' '),
            score: parseInt(entries.score),
            date: entries.date
          }];
        }
      }
      setScores(newScores);
    } catch (err) {
      console.error("Failed to fetch scores", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    if (isGameOver) {
      setIsOpen(true);
      fetchScores();
    }
  }, [isGameOver, fetchScores]);

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || currentScore === 0) return;

    if (containsProfanity(playerName.trim())) {
      setIsError(true);
      setPlayerName('Küfür/Argo Yasak!');
      return;
    }

    const safeName = playerName.trim().substring(0, 15);

    setLoading(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: safeName, score: currentScore })
      });
      await fetchScores(); // refresh
      setPlayerName('');
      setIsError(false);
      onSave();
    } catch (err) {
      console.error("Failed to save score", err);
    } finally {
      setLoading(false);
    }
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
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchScores();
        }}
      >
        <div className="flex items-center gap-3 text-toon-yellow">
          <Trophy weight="fill" className="w-6 h-6" />
          <h3 className="font-display text-xl uppercase tracking-widest mt-1">GLOBAL LİDERLİK TABLOSU</h3>
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
                  maxLength={15}
                  required
                  disabled={loading}
                  className={`flex-grow bg-slate-800 border-2 text-white p-2 outline-none rounded font-mono transition-colors ${
                    isError 
                      ? 'border-red-500 bg-red-500/20 text-red-400 animate-pulse' 
                      : 'border-slate-600 focus:border-toon-orange'
                  } disabled:opacity-50`}
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-toon-orange text-white font-bold px-4 py-2 rounded hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {loading ? <SpinnerGap className="animate-spin" weight="bold" /> : "KAYDET"}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {loading && scores.length === 0 ? (
              <p className="text-slate-500 font-mono text-center py-4 flex items-center justify-center gap-2">
                <SpinnerGap className="animate-spin" /> Yükleniyor...
              </p>
            ) : scores.length === 0 ? (
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
