import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface SpinningWheelProps {
  onSpinComplete: (value: number) => void;
  disabled?: boolean;
}

const SEGMENTS = [
  { value: 100, color: "hsl(var(--primary))" },
  { value: 200, color: "hsl(var(--secondary))" },
  { value: 300, color: "hsl(var(--accent))" },
  { value: 400, color: "hsl(var(--success))" },
  { value: 500, color: "hsl(var(--primary))" },
  { value: 600, color: "hsl(var(--secondary))" },
  { value: 800, color: "hsl(var(--accent))" },
  { value: 1000, color: "hsl(var(--success))" },
  { value: 0, color: "hsl(var(--destructive))", label: "BANKRUPT" },
  { value: 250, color: "hsl(var(--primary))" },
  { value: 350, color: "hsl(var(--secondary))" },
  { value: 750, color: "hsl(var(--accent))" },
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
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <div 
            className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-foreground"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        </div>
        
        {/* Wheel */}
        <svg 
          width="220" 
          height="220" 
          viewBox="0 0 220 220"
          className="drop-shadow-lg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {/* Outer ring */}
          <circle cx="110" cy="110" r="108" fill="none" stroke="hsl(var(--foreground))" strokeWidth="4" />
          
          {SEGMENTS.map((segment, index) => {
            const startAngle = index * segmentAngle - 90;
            const endAngle = startAngle + segmentAngle;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 110 + 100 * Math.cos(startRad);
            const y1 = 110 + 100 * Math.sin(startRad);
            const x2 = 110 + 100 * Math.cos(endRad);
            const y2 = 110 + 100 * Math.sin(endRad);
            
            const largeArc = segmentAngle > 180 ? 1 : 0;
            
            const pathD = `M 110 110 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            // Text position
            const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
            const textX = 110 + 65 * Math.cos(midAngle);
            const textY = 110 + 65 * Math.sin(midAngle);
            const textRotation = (startAngle + endAngle) / 2 + 90;
            
            return (
              <g key={index}>
                <path d={pathD} fill={segment.color} stroke="hsl(var(--background))" strokeWidth="1" />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize={segment.label ? "8" : "11"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {segment.label || `$${segment.value}`}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle cx="110" cy="110" r="15" fill="hsl(var(--foreground))" />
          <circle cx="110" cy="110" r="10" fill="hsl(var(--background))" />
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
