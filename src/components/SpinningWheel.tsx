import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface WheelSegment {
  id: any;
  label: string;
  color: string;
}

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinComplete: (segmentId: any) => void;
  disabled?: boolean;
}

const SpinningWheel = ({ segments, onSpinComplete, disabled }: SpinningWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Ensure we have segments
  const safeSegments = segments.length > 0 ? segments : [{ id: 0, label: "?", color: "#ccc" }];
  const segmentAngle = 360 / safeSegments.length;

  const spin = useCallback(() => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    
    // Random number of full rotations (3-6) plus random segment
    const fullRotations = 3 + Math.floor(Math.random() * 4);
    const randomSegmentIndex = Math.floor(Math.random() * safeSegments.length);
    
    // Calculate target rotation to land on the random segment
    // The pointer is at the top (270 degrees or -90 degrees in SVG space, but let's stick to standard rotation)
    // If we rotate the wheel, the segment at the top changes.
    // To land on segment i, we need the wheel to be rotated such that segment i is at the top.
    // Segment i spans from (i * angle) to ((i+1) * angle). Center is (i + 0.5) * angle.
    // We want (i + 0.5) * angle to be at -90deg (top).
    // So Rotation + (i + 0.5) * angle = -90 (mod 360)
    // Rotation = -90 - (i + 0.5) * angle
    // But we are adding to current rotation.
    
    // Simpler approach:
    // Just rotate by a random amount, then calculate what is at the top.
    const segmentRotation = randomSegmentIndex * segmentAngle;
    // Add some randomness within the segment to avoid landing on lines
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    
    const newRotation = rotation + (fullRotations * 360) + segmentRotation + randomOffset;
    
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      
      // Calculate landed segment
      // Normalize rotation to 0-360
      const normalizedRotation = newRotation % 360;
      // The pointer is at the top (0 degrees visually, but let's say 270 in standard circle math, or -90).
      // In the SVG, 0 degrees is 3 o'clock. Top is 270 degrees (or -90).
      // If we rotate the group by R degrees, the point at angle A becomes A + R.
      // We want to find which segment's angle range [start, end] contains the pointer angle.
      // Pointer angle relative to the wheel is: (Pointer - Rotation) % 360.
      // Pointer is at -90 (top).
      // So relative angle = (-90 - normalizedRotation) % 360.
      // Let's make it positive.
      let relativeAngle = (-90 - normalizedRotation) % 360;
      if (relativeAngle < 0) relativeAngle += 360;
      
      const landedIndex = Math.floor(relativeAngle / segmentAngle);
      // Clamp just in case
      const finalIndex = Math.min(Math.max(landedIndex, 0), safeSegments.length - 1);
      
      onSpinComplete(safeSegments[finalIndex].id);
    }, 4000);
  }, [isSpinning, disabled, rotation, segmentAngle, onSpinComplete, safeSegments]);

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
          
          {safeSegments.map((segment, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            
            // SVG arc path
            // 0 degrees is 3 o'clock.
            // We want to start drawing from startAngle.
            
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
            const textRotation = (startAngle + endAngle) / 2 + 90; // Rotate text to be readable
            
            // Determine text color based on background brightness (simple heuristic)
            // Assuming hex colors
            const isDarkBg = ["#dc6bad", "#8c7aa9", "#7192be", "#000000", "#333333"].includes(segment.color.toLowerCase());
            
            return (
              <g key={index}>
                <path d={pathD} fill={segment.color} stroke="hsl(var(--background))" strokeWidth="2" />
                <text
                  x={textX}
                  y={textY}
                  fill={isDarkBg ? "white" : "#1a1a1a"}
                  fontSize={safeSegments.length > 20 ? "10" : "14"}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  style={{ textShadow: isDarkBg ? "1px 1px 2px rgba(0,0,0,0.5)" : "none" }}
                >
                  {segment.label}
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
        {isSpinning ? "PUSING..." : "PUSING!"}
      </Button>
    </div>
  );
};

export default SpinningWheel;
