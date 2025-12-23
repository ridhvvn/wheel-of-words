import { Star, Zap } from "lucide-react";

interface ScoreBoardProps {
  score: number;
  wrongGuesses: number;
  maxWrongGuesses: number;
}

export const ScoreBoard = ({ score, wrongGuesses, maxWrongGuesses }: ScoreBoardProps) => {
  const livesLeft = maxWrongGuesses - wrongGuesses;

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10">
      {/* Score */}
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur rounded-xl px-4 py-2 border border-primary/30">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <span className="font-display text-2xl sm:text-3xl text-primary glow-text">
          ${score.toLocaleString()}
        </span>
      </div>

      {/* Lives */}
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur rounded-xl px-4 py-2 border border-destructive/30">
        <div className="flex gap-1">
          {Array.from({ length: maxWrongGuesses }).map((_, i) => (
            <Zap
              key={i}
              className={`w-5 h-5 transition-all duration-300 ${
                i < livesLeft
                  ? "text-primary fill-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
