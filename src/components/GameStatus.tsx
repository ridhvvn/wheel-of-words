import { Trophy, XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface GameStatusProps {
  status: "playing" | "won" | "lost";
  phrase: string;
  onNewGame: () => void;
}

export const GameStatus = ({ status, phrase, onNewGame }: GameStatusProps) => {
  if (status === "playing") return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-reveal">
        {status === "won" ? (
          <>
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-4xl text-primary glow-text">
              WINNER!
            </h2>
            <p className="text-muted-foreground">
              You solved the puzzle!
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="font-display text-4xl text-destructive">
              GAME OVER
            </h2>
            <p className="text-muted-foreground">
              The answer was:
            </p>
            <p className="font-display text-2xl text-foreground">
              {phrase}
            </p>
          </>
        )}
        <Button variant="spin" size="xl" onClick={onNewGame}>
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
};
