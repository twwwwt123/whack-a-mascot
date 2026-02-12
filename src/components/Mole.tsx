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
    setTimeout(() => setIsHit(false), 500);
  };

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Hole rim */}
      <div className="absolute bottom-0 w-28 h-12 rounded-[50%] bg-hole" />
      {/* Hole inner */}
      <div className="absolute bottom-1 w-24 h-10 rounded-[50%] bg-hole-inner overflow-hidden flex items-end justify-center">
        {/* Mole container with clip */}
        <div className="relative w-full h-full overflow-hidden flex items-end justify-center">
          <div
            className={`transition-all ease-out ${isHit ? 'duration-500' : 'duration-150'}`}
            style={{
              transform: isUp && !isHit
                ? "translateY(0)"
                : isHit
                  ? "translateY(110%)"
                  : "translateY(110%)",
              animation: isHit ? "mole-hit 0.5s ease-out" : "none",
            }}
          >
            {/* Stars when hit */}
            {isHit && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                <svg width="60" height="24" viewBox="0 0 60 24" className="animate-hit-stars">
                  <text x="6" y="12" fontSize="10" className="animate-star-1">⭐</text>
                  <text x="24" y="8" fontSize="12" className="animate-star-2">💫</text>
                  <text x="42" y="12" fontSize="10" className="animate-star-3">⭐</text>
                </svg>
              </div>
            )}
            <MoleSVG isHit={isHit} />
          </div>
        </div>
      </div>
      {/* Clickable overlay - always present for consistent touch targets */}
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className="absolute inset-0 z-10 cursor-pointer"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        aria-label="打地鼠"
      />
    </div>
  );
};

export const MoleSVG = ({ isHit = false, size = 48 }: { isHit?: boolean; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 44"
    className={`cursor-pointer transition-transform ${isHit ? 'animate-mole-wobble' : ''}`}
  >
    {/* Ears */}
    <ellipse cx="10" cy="10" rx="6" ry="7" fill="hsl(45, 85%, 55%)" />
    <ellipse cx="10" cy="10" rx="3.5" ry="4.5" fill="hsl(15, 70%, 70%)" />
    <ellipse cx="38" cy="10" rx="6" ry="7" fill="hsl(45, 85%, 55%)" />
    <ellipse cx="38" cy="10" rx="3.5" ry="4.5" fill="hsl(15, 70%, 70%)" />
    {/* Body */}
    <ellipse cx="24" cy="24" rx="18" ry="16" fill="hsl(45, 85%, 60%)" />
    {/* Cheeks */}
    <circle cx="12" cy="27" r="4.5" fill="hsl(15, 80%, 70%)" opacity="0.5" />
    <circle cx="36" cy="27" r="4.5" fill="hsl(15, 80%, 70%)" opacity="0.5" />
    {/* Eyes */}
    {isHit ? (
      <>
        <text x="14" y="22" fontSize="8" textAnchor="middle" fill="hsl(25, 40%, 12%)">✖</text>
        <text x="34" y="22" fontSize="8" textAnchor="middle" fill="hsl(25, 40%, 12%)">✖</text>
      </>
    ) : (
      <>
        <circle cx="16" cy="19" r="4" fill="white" />
        <circle cx="32" cy="19" r="4" fill="white" />
        <circle cx="17" cy="18.5" r="2.2" fill="hsl(25, 40%, 12%)" />
        <circle cx="33" cy="18.5" r="2.2" fill="hsl(25, 40%, 12%)" />
        <circle cx="17.8" cy="17.5" r="0.9" fill="white" />
        <circle cx="33.8" cy="17.5" r="0.9" fill="white" />
      </>
    )}
    {/* Nose */}
    <ellipse cx="24" cy="24" rx="3" ry="2.2" fill="hsl(15, 50%, 45%)" />
    {/* Mouth & Teeth */}
    <path d="M19 29 Q24 33 29 29" fill="none" stroke="hsl(25, 40%, 12%)" strokeWidth="1.2" />
    <rect x="21" y="29" width="2.5" height="3" rx="0.5" fill="white" />
    <rect x="24.5" y="29" width="2.5" height="3" rx="0.5" fill="white" />
  </svg>
);

export default Mole;
