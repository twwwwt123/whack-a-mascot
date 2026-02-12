import { useState, useEffect, useCallback, useRef } from "react";
import Mole, { MoleSVG } from "./Mole";

type GameState = "idle" | "playing";

interface HolePos {
  x: number;
  y: number;
}

function generateHoles(count: number): HolePos[] {
  const holes: HolePos[] = [];
  const minDist = 22; // minimum distance between holes (%)
  let attempts = 0;

  while (holes.length < count && attempts < 500) {
    const x = 10 + Math.random() * 75;
    const y = 10 + Math.random() * 70;
    const tooClose = holes.some(
      (h) => Math.hypot(h.x - x, h.y - y) < minDist
    );
    if (!tooClose) {
      holes.push({ x, y });
    }
    attempts++;
  }
  return holes;
}

function getDifficulty(score: number) {
  if (score >= 60) return { duration: 400, maxMoles: 4 };
  if (score >= 50) return { duration: 500, maxMoles: 4 };
  if (score >= 40) return { duration: 600, maxMoles: 3 };
  if (score >= 30) return { duration: 700, maxMoles: 3 };
  if (score >= 20) return { duration: 800, maxMoles: 2 };
  if (score >= 10) return { duration: 1000, maxMoles: 2 };
  return { duration: 1200, maxMoles: 1 };
}

function getMilestone(score: number): string | null {
  if (score >= 60) return "🔥 🔥 🔥";
  if (score >= 50) return "👑 你是冠军！";
  if (score >= 40) return "🚀 超越极限！";
  if (score >= 30) return "🏆 地鼠克星！";
  if (score >= 20) return "⚡ 无人能挡！";
  if (score >= 10) return "🎉 手感火热！";
  return null;
}

const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [holes, setHoles] = useState<HolePos[]>(() => generateHoles(6));
  const [activeMoles, setActiveMoles] = useState<Set<number>>(new Set());
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreRef = useRef(0);

  scoreRef.current = score;

  const spawnMoles = useCallback(() => {
    const { duration, maxMoles } = getDifficulty(scoreRef.current);

    // Pick random holes
    const available = Array.from({ length: 6 }, (_, i) => i);
    const count = Math.min(maxMoles, 1 + Math.floor(Math.random() * maxMoles));
    const selected = new Set<number>();
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * available.length);
      selected.add(available.splice(idx, 1)[0]);
    }

    setActiveMoles(selected);

    // Hide after duration
    setTimeout(() => {
      setActiveMoles(new Set());
    }, duration);

    // Schedule next spawn
    const nextDelay = duration + 200 + Math.random() * 400;
    timerRef.current = setTimeout(spawnMoles, nextDelay);
  }, []);

  const startGame = () => {
    setScore(0);
    setShowMilestone(null);
    setActiveMoles(new Set());
    setHoles(generateHoles(6));
    setGameState("playing");
  };

  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMoles(new Set());
    setGameState("idle");
    setScore(0);
    setShowMilestone(null);
    setHoles(generateHoles(6));
  };

  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setTimeout(spawnMoles, 500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, spawnMoles]);

  const handleWhack = (index: number) => {
    setActiveMoles((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
    const newScore = score + 1;
    setScore(newScore);

    const milestone = getMilestone(newScore);
    if (milestone && milestone !== showMilestone) {
      setShowMilestone(milestone);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-4 py-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <div className="flex items-center gap-1.5">
          <MoleSVG size={28} />
          <h1 className="text-xl font-black text-primary text-shadow-game">
            打地鼠
          </h1>
        </div>
        <div className="bg-secondary/80 rounded-xl px-4 py-1.5 font-black text-secondary-foreground text-lg">
          计分 {score}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        {gameState === "idle" && (
          <button
            onClick={startGame}
            className="bg-primary text-primary-foreground font-black text-lg px-6 py-2.5 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            开始游戏
          </button>
        )}
        {gameState === "playing" && (
          <button
            onClick={resetGame}
            className="bg-accent text-accent-foreground font-black text-base px-5 py-2 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            重新开始
          </button>
        )}
      </div>

      {/* Game Area */}
      <div className="relative w-full max-w-md aspect-square rounded-3xl bg-grass-light shadow-inner overflow-hidden border-4 border-grass-dark">
        {/* Grass texture dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`grass-${i}`}
            className="absolute w-2 h-2 rounded-full bg-grass-dark/30 pointer-events-none"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
          />
        ))}

        {/* Holes with Moles */}
        {holes.map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Mole isUp={activeMoles.has(i)} onWhack={() => handleWhack(i)} />
          </div>
        ))}

        {/* Idle overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px] flex items-center justify-center rounded-3xl pointer-events-none">
            <p className="text-primary font-black text-2xl text-shadow-game">
              👆 点击开始
            </p>
          </div>
        )}
      </div>

      {/* Milestone */}
      <div className="h-12 flex items-center justify-center mt-4">
        {showMilestone && (
          <p
            key={showMilestone}
            className="text-primary font-black text-2xl animate-bounce text-shadow-game"
          >
            {showMilestone}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
