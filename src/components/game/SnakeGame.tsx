import { useState, useEffect, useCallback, useRef } from 'react';
import { Play } from '@phosphor-icons/react';

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setFood(generateFood(initialSnake));
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - score * 2);
    const gameInterval = setInterval(moveSnake, speed);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isGameOver, direction, food, score, generateFood]);

  return (
    <div className="relative w-80 h-80 bg-[var(--color-toon-card)] border-4 border-black rounded-xl shadow-[8px_8px_0_0_rgba(59,130,246,1)] overflow-hidden flex flex-col focus:outline-none select-none">
      {/* Header */}
      <div className="bg-black text-[var(--color-toon-blue)] px-4 py-2 flex justify-between items-center font-mono text-sm border-b-4 border-black">
        <span>SNAKE.EXE</span>
        <span>SCORE: {score.toString().padStart(4, '0')}</span>
      </div>

      {/* Game Area */}
      <div className="flex-grow bg-[var(--color-toon-bg)] relative">
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            backgroundColor: '#1e293b',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        >
          {/* Food */}
          <div
            className="absolute bg-[var(--color-toon-orange)] rounded-sm"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              boxShadow: '0 0 5px var(--color-toon-orange)'
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute border border-[#1e293b] ${
                index === 0 ? 'bg-white z-10' : 'bg-[var(--color-toon-blue)]'
              }`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: index === 0 ? '4px' : '2px',
              }}
            />
          ))}
        </div>

        {/* Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm z-20">
            {isGameOver ? (
              <>
                <h3 className="font-display text-3xl text-[var(--color-toon-orange)] mb-2 uppercase">Game Over</h3>
                <p className="font-mono text-white mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="toon-button bg-[var(--color-toon-blue)] px-6 py-2"
                >
                  <Play weight="fill" /> Play Again
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-[var(--color-toon-blue)] rounded-xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-4 flex items-center justify-center text-white">
                  <Play weight="fill" className="w-8 h-8 ml-1" />
                </div>
                <h3 className="font-display text-xl text-white mb-2 uppercase">Snake Break</h3>
                <p className="font-mono text-slate-300 text-sm mb-6 max-w-[200px]">
                  Use W,A,S,D or Arrow keys to move
                </p>
                <button 
                  onClick={resetGame}
                  className="toon-badge bg-[var(--color-toon-orange)] text-black border-black cursor-pointer hover:bg-white px-6 py-2 text-sm"
                  style={{ cursor: 'url(/cursors/pointer.png) 4 4, pointer' }}
                >
                  START GAME
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
