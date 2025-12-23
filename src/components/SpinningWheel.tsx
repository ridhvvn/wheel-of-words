import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface SpinningWheelProps {
  onSpinComplete: (value: number) => void;
  disabled?: boolean;
}

const SEGMENTS = [
  { value: 100, color: "#FCF8E8" },
  { value: 200, color: "#ECDFC8" },
  { value: 300, color: "#ECB390" },
  { value: 400, color: "#DF7861" },
  { value: 500, color: "#FF370F" },
  { value: 600, color: "#FCF8E8" },
  { value: 800, color: "#ECDFC8" },
  { value: 1000, color: "#ECB390" },
  { value: 0, color: "#FF370F", label: "BANKRUPT" },
  { value: 250, color: "#DF7861" },
  { value: 350, color: "#FCF8E8" },
  { value: 750, color: "#ECDFC8" },
];

const SpinningWheel = ({ onSpinComplete, disabled }: SpinningWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const segmentAngle = 360 / SEGMENTS.length;

  const spin = useCallback(() => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    
    // Random number of full rotations (3-6) plus random segment
    const fullRotations = 3 + Math.floor(Math.random() * 4);
    const randomSegment = Math.floor(Math.random() * SEGMENTS.length);
    const segmentRotation = randomSegment * segmentAngle;
    const newRotation = rotation + (fullRotations * 360) + segmentRotation;
    
    setRotation(newRotation);

    // Calculate which segment we land on (accounting for pointer at top)
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const landedIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % SEGMENTS.length;
      const landedValue = SEGMENTS[landedIndex].value;
      
      setIsSpinning(false);
      onSpinComplete(landedValue);
    }, 4000);
  }, [isSpinning, disabled, rotation, segmentAngle, onSpinComplete]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div 
            className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-foreground"
            style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.4))" }}
          />
        </div>
        
        {/* Wheel */}
        <svg 
          width="340" 
          height="340" 
          viewBox="0 0 340 340"
          className="drop-shadow-xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {/* Outer ring */}
          <circle cx="170" cy="170" r="165" fill="none" stroke="hsl(var(--foreground))" strokeWidth="6" />
          
          {SEGMENTS.map((segment, index) => {
            const startAngle = index * segmentAngle - 90;
            const endAngle = startAngle + segmentAngle;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 170 + 160 * Math.cos(startRad);
            const y1 = 170 + 160 * Math.sin(startRad);
            const x2 = 170 + 160 * Math.cos(endRad);
            const y2 = 170 + 160 * Math.sin(endRad);
            
            const largeArc = segmentAngle > 180 ? 1 : 0;
            
            const pathD = `M 170 170 L ${x1} ${y1} A 160 160 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            // Text position
            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
            const textX = 170 + 100 * Math.cos(midAngle);
            const textY = 170 + 100 * Math.sin(midAngle);
            const textRotation = (startAngle + endAngle) / 2 + 90;
            
            // Determine text color based on background brightness
            const isDarkBg = segment.color === "#FF370F" || segment.color === "#DF7861";
            
            return (
              <g key={index}>
                <path d={pathD} fill={segment.color} stroke="hsl(var(--background))" strokeWidth="2" />
                <text
                  x={textX}
                  y={textY}
                  fill={isDarkBg ? "white" : "#1a1a1a"}
                  fontSize={segment.label ? "11" : "14"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  style={{ textShadow: isDarkBg ? "1px 1px 2px rgba(0,0,0,0.5)" : "none" }}
                >
                  {segment.label || `$${segment.value}`}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle cx="170" cy="170" r="22" fill="hsl(var(--foreground))" />
          <circle cx="170" cy="170" r="15" fill="hsl(var(--background))" />
        </svg>
      </div>
      
      <Button
        onClick={spin}
        disabled={isSpinning || disabled}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 text-lg rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
      >
        {isSpinning ? "SPINNING..." : "SPIN!"}
      </Button>
    </div>
  );
};

export default SpinningWheel;
