import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameHeader } from "@/components/GameHeader";
import { LetterBoard } from "@/components/LetterBoard";
import { Keyboard } from "@/components/Keyboard";
import { useGameStore } from "@/stores/gameStore";
import { Card } from "@/components/ui/card";
import { Clock, Trophy } from "lucide-react";

const GamePage = () => {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    revealedLetters,
    usedLetters,
    score,
    gamePhase,
    guessLetter,
    tickTimer,
    timerRemaining,
    isTimerRunning,
    resetGame
  } = useGameStore();

  // Timer effect handled in GameLayout

  // Navigation effect
  useEffect(() => {
    if (gamePhase === "spin") {
      navigate("/spin");
    } else if (gamePhase === "setup") {
      navigate("/");
    }
    // Result navigation handled in GameLayout
  }, [gamePhase, navigate]);

  // Safety check
  const currentQuestion = questions.find((_, i) => i === currentQuestionIndex);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNewGame = () => {
    resetGame();
    navigate("/");
  };

  if (!currentQuestion && gamePhase === "play") return null;

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GameHeader onNewGame={handleNewGame} />

        <main className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 p-4">
          
          {/* Info Bar */}
          <div className="flex gap-4 w-full max-w-4xl justify-between items-center">
             <Card className="p-4 flex items-center gap-3 bg-card/50 backdrop-blur">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Masa</p>
                  <p className="text-xl font-bold font-mono">{formatTime(timerRemaining)}</p>
                </div>
             </Card>

             <Card className="p-4 flex items-center gap-3 bg-card/50 backdrop-blur">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Markah</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
             </Card>
          </div>

          {/* Category/Tahap */}
          <div className="bg-secondary/20 px-6 py-2 rounded-full">
            <p className="text-sm font-medium text-secondary-foreground uppercase tracking-wider">
              Tahap: {currentQuestion?.tahap || "Unknown"} | Markah: {currentQuestion?.markah || 0}
            </p>
          </div>

          {/* Letter Board */}
          <div className="w-full max-w-4xl bg-card/30 backdrop-blur border border-border rounded-2xl p-4 sm:p-6">
            <LetterBoard
              phrase={currentQuestion?.peribahasa || ""}
              revealedLetters={revealedLetters}
              newlyRevealedLetter={null}
            />
          </div>

          {/* Keyboard */}
          <Keyboard
            usedLetters={usedLetters}
            onLetterClick={guessLetter}
          />
        </main>
      </div>
    </div>
  );
};

export default GamePage;
