import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface GameHeaderProps {
  onNewGame: () => void;
}

export const GameHeader = ({ onNewGame }: GameHeaderProps) => {
  return (
    <header className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-4">
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider">
        <span className="text-primary glow-text">WHEEL</span>
        <span className="text-foreground"> OF </span>
        <span className="text-secondary">FORTUNE</span>
      </h1>
      <Button variant="outline" size="sm" onClick={onNewGame} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        <span className="hidden sm:inline">New Game</span>
      </Button>
    </header>
  );
};
