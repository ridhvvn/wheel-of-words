import { Lightbulb } from "lucide-react";
import { Button } from "./ui/button";

interface ClueLettersProps {
  clueLetters: string[];
  onUseClue: () => void;
  cluesRemaining: number;
  disabled?: boolean;
}

export const ClueLetters = ({ clueLetters, onUseClue, cluesRemaining, disabled }: ClueLettersProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onUseClue}
          disabled={disabled || cluesRemaining === 0}
          className="gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <Lightbulb className="w-4 h-4" />
          Use Clue ({cluesRemaining})
        </Button>
      </div>
      {clueLetters.length > 0 && (
        <div className="flex items-center gap-2 bg-accent/10 rounded-lg px-4 py-2 border border-accent/30">
          <span className="text-sm text-muted-foreground">Revealed clues:</span>
          <div className="flex gap-1">
            {clueLetters.map((letter, i) => (
              <span
                key={i}
                className="w-8 h-8 bg-accent/20 rounded flex items-center justify-center font-display text-lg text-accent"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
