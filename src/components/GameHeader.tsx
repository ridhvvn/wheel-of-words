import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useGameStore } from "@/stores/gameStore";

interface GameHeaderProps {
  onNewGame: () => void;
}

export const GameHeader = ({ onNewGame }: GameHeaderProps) => {
  const { isMusicMuted, toggleMusic } = useGameStore();

  return (
    <header className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-4">
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wider">
        <span className="text-primary glow-text">RODA</span>
        <span className="text-foreground"> </span>
        <span className="text-secondary">PERIBAHASA</span>
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMusic} title={isMusicMuted ? "Unmute Music" : "Mute Music"}>
          {isMusicMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <Button variant="outline" size="sm" onClick={onNewGame} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Permainan Baru</span>
        </Button>
      </div>
    </header>
  );
};
