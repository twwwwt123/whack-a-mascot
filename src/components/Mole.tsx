import { useState } from "react";

interface MoleProps {
  isUp: boolean;
  onWhack: () => void;
}

const Mole = ({ isUp, onWhack }: MoleProps) => {
  const [isHit, setIsHit] = useState(false);

  const handleClick = () => {
    if (!isUp || isHit) return;
    setIsHit(true);
    onWhack();
    setTimeout(() => setIsHit(false), 300);
  };

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Hole rim */}
      <div className="absolute bottom-0 w-24 h-10 rounded-[50%] bg-hole" />
      {/* Hole inner */}
      <div className="absolute bottom-1 w-20 h-8 rounded-[50%] bg-hole-inner overflow-hidden flex items-end justify-center">
        {/* Mole container with clip */}
        <div className="relative w-full h-full overflow-hidden flex items-end justify-center">
          <div
            className="transition-transform duration-150 ease-out"
            style={{
              transform: isUp && !isHit ? "translateY(0)" : "translateY(100%)",
            }}
          >
            {/* Mole SVG */}
            <svg width="40" height="36" viewBox="0 0 40 36" className={`cursor-pointer ${isHit ? 'scale-75' : ''} transition-transform`}>
              {/* Body */}
              <ellipse cx="20" cy="20" rx="16" ry="14" fill="hsl(45, 85%, 60%)" />
              {/* Cheeks */}
              <circle cx="10" cy="22" r="4" fill="hsl(15, 80%, 70%)" opacity="0.6" />
              <circle cx="30" cy="22" r="4" fill="hsl(15, 80%, 70%)" opacity="0.6" />
              {/* Eyes */}
              <circle cx="14" cy="16" r="3.5" fill="white" />
              <circle cx="26" cy="16" r="3.5" fill="white" />
              <circle cx="15" cy="15.5" r="2" fill="hsl(25, 40%, 12%)" />
              <circle cx="27" cy="15.5" r="2" fill="hsl(25, 40%, 12%)" />
              {/* Eye shine */}
              <circle cx="15.8" cy="14.5" r="0.8" fill="white" />
              <circle cx="27.8" cy="14.5" r="0.8" fill="white" />
              {/* Nose */}
              <ellipse cx="20" cy="20" rx="2.5" ry="2" fill="hsl(15, 50%, 45%)" />
              {/* Mouth & Teeth */}
              <path d="M16 24 Q20 28 24 24" fill="none" stroke="hsl(25, 40%, 12%)" strokeWidth="1" />
              <rect x="17.5" y="24" width="2.2" height="2.5" rx="0.5" fill="white" />
              <rect x="20.3" y="24" width="2.2" height="2.5" rx="0.5" fill="white" />
            </svg>
          </div>
        </div>
      </div>
      {/* Clickable overlay */}
      {isUp && !isHit && (
        <button
          onClick={handleClick}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label="打地鼠"
        />
      )}
    </div>
  );
};

export default Mole;
