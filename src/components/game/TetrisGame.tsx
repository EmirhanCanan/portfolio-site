import { useState, useCallback, useEffect } from 'react';
import { Play, ArrowCounterClockwise, CaretDown, CaretLeft, CaretRight, CaretUp } from '@phosphor-icons/react';
import { useInterval } from '../../hooks/useInterval';
import { Scoreboard } from './Scoreboard';

const STAGE_WIDTH = 10;
const STAGE_HEIGHT = 20;

type TetrominoType = 0 | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

const TETROMINOS: Record<TetrominoType, { shape: (TetrominoType | 0)[][]; color: string }> = {
  0: { shape: [[0]], color: 'transparent' },
  I: { shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]], color: '#38bdf8' },
  J: { shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]], color: '#3b82f6' },
  L: { shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']], color: '#f97316' },
  O: { shape: [['O', 'O'], ['O', 'O']], color: '#eab308' },
  S: { shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], color: '#22c55e' },
  T: { shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]], color: '#a855f7' },
  Z: { shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], color: '#ef4444' },
};

const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)] as TetrominoType;
  return TETROMINOS[randTetromino];
};

type Cell = [TetrominoType, 'clear' | 'merged'];
type Stage = Cell[][];

const createStage = (): Stage =>
  Array.from(Array(STAGE_HEIGHT), () => new Array(STAGE_WIDTH).fill([0, 'clear']));

export function TetrisGame() {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const [stage, setStage] = useState(createStage());
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const [showSaveScore, setShowSaveScore] = useState(false);

  // Check collision
  const checkCollision = (playerObj: typeof player, tempStage: Stage, { x: moveX, y: moveY }: { x: number; y: number }) => {
    for (let y = 0; y < playerObj.tetromino.length; y += 1) {
      for (let x = 0; x < playerObj.tetromino[y].length; x += 1) {
        if (playerObj.tetromino[y][x] !== 0) {
          if (
            !tempStage[y + playerObj.pos.y + moveY] ||
            !tempStage[y + playerObj.pos.y + moveY][x + playerObj.pos.x + moveX] ||
            tempStage[y + playerObj.pos.y + moveY][x + playerObj.pos.x + moveX][1] !== 'clear'
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const sweepRows = (newStage: Stage) => {
    let linesCleared = 0;
    const ackStage = newStage.reduce((ack, row) => {
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        linesCleared += 1;
        ack.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']));
        return ack;
      }
      ack.push(row);
      return ack;
    }, [] as Stage);

    if (linesCleared > 0) {
      setScore((prevScore) => prevScore + [40, 100, 300, 1200][linesCleared - 1] * (level + 1));
      setRows((prevRows) => prevRows + linesCleared);
      setLevel(Math.floor((rows + linesCleared) / 10));
    }
    return ackStage;
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  const startGame = () => {
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setHasStarted(true);
    setScore(0);
    setRows(0);
    setLevel(0);
    setShowSaveScore(false);
  };

  const drop = () => {
    if (checkCollision(player, stage, { x: 0, y: 1 })) {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        setShowSaveScore(true);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    } else {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver && hasStarted) {
      // Activate drop time when user releases down arrow
      if (keyCode === 40 || keyCode === 83) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const rotate = (matrix: (TetrominoType | 0)[][], dir: number) => {
    const rotatedTetro = matrix.map((_, index) => matrix.map((col) => col[index]));
    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage: Stage, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const move = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver && hasStarted) {
      if (keyCode === 37 || keyCode === 65) {
        movePlayer(-1);
      } else if (keyCode === 39 || keyCode === 68) {
        movePlayer(1);
      } else if (keyCode === 40 || keyCode === 83) {
        dropPlayer();
      } else if (keyCode === 38 || keyCode === 87) {
        playerRotate(stage, 1);
      }
    }
  };

  // Prevent default scrolling for arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if ([37, 38, 39, 40, 32].includes(e.keyCode) && hasStarted && !gameOver) {
        e.preventDefault();
      }
      move(e);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      keyUp(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hasStarted, gameOver, player, stage, dropPlayer, movePlayer, playerRotate]);

  useEffect(() => {
    const updateStage = (prevStage: Stage) => {
      const newStage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      ) as Stage;

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            if (newStage[y + player.pos.y] && newStage[y + player.pos.y][x + player.pos.x]) {
              newStage[y + player.pos.y][x + player.pos.x] = [value, `${player.collided ? 'merged' : 'clear'}`];
            }
          }
        });
      });

      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative bg-[#0f172a] border-4 border-toon-blue rounded-xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] max-w-xl mx-auto w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
        
        {/* Game Area */}
        {hasStarted && !gameOver && (
          <div className="flex gap-4 h-full w-full justify-center">
            {/* Stage */}
            <div 
              className="grid bg-[#020617] border-2 border-slate-700 h-full aspect-[1/2]" 
              style={{ 
                gridTemplateRows: `repeat(${STAGE_HEIGHT}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${STAGE_WIDTH}, minmax(0, 1fr))`
              }}
            >
              {stage.map(row => row.map((cell, x) => (
                <div 
                  key={x} 
                  style={{ 
                    backgroundColor: cell[0] === 0 ? 'transparent' : TETROMINOS[cell[0]].color,
                    border: cell[0] === 0 ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.5)'
                  }}
                  className={`${cell[0] !== 0 ? 'shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3),inset_2px_2px_0_rgba(255,255,255,0.3)]' : ''}`}
                />
              )))}
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-4 text-white font-mono">
              <div className="bg-slate-900 border-2 border-slate-700 p-2 rounded">
                <p className="text-slate-400 text-xs">SCORE</p>
                <p className="text-xl font-bold">{score}</p>
              </div>
              <div className="bg-slate-900 border-2 border-slate-700 p-2 rounded">
                <p className="text-slate-400 text-xs">LEVEL</p>
                <p className="text-xl font-bold">{level}</p>
              </div>
              <div className="bg-slate-900 border-2 border-slate-700 p-2 rounded">
                <p className="text-slate-400 text-xs">LINES</p>
                <p className="text-xl font-bold">{rows}</p>
              </div>
              
              <div className="mt-auto hidden sm:grid grid-cols-3 gap-1 text-slate-500 opacity-50 text-xs text-center">
                <div/><div><CaretUp weight="bold" className="mx-auto w-6 h-6"/></div><div/>
                <div><CaretLeft weight="bold" className="mx-auto w-6 h-6"/></div>
                <div><CaretDown weight="bold" className="mx-auto w-6 h-6"/></div>
                <div><CaretRight weight="bold" className="mx-auto w-6 h-6"/></div>
              </div>
            </div>
          </div>
        )}

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
            <h2 className="text-4xl font-display text-white mb-6 uppercase tracking-widest drop-shadow-[2px_2px_0_var(--color-toon-blue)]">TETRIS</h2>
            <p className="font-mono text-slate-300 mb-8 text-center max-w-[200px]">Use Arrow Keys or WASD to move and rotate.</p>
            <button onClick={startGame} className="toon-button bg-toon-orange text-white">
              <Play weight="fill" /> PLAY NOW
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 p-6">
            <h2 className="text-5xl font-display text-red-500 mb-2 uppercase tracking-widest drop-shadow-[2px_2px_0_#fff]">GAME OVER</h2>
            <p className="font-mono text-xl text-white mb-8">Score: {score}</p>
            
            <button onClick={startGame} className="toon-button bg-toon-blue text-white w-full max-w-[200px] mb-4">
              <ArrowCounterClockwise weight="bold" /> TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <Scoreboard currentScore={score} isGameOver={showSaveScore} onSave={() => setShowSaveScore(false)} />
    </div>
  );
}
