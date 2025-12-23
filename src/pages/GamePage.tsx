import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameHeader } from "@/components/GameHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { LetterBoard } from "@/components/LetterBoard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { ClueLetters } from "@/components/ClueLetters";
import { Keyboard } from "@/components/Keyboard";
import { GameStatus } from "@/components/GameStatus";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const GamePage = () => {
  const navigate = useNavigate();
  const {
    currentPuzzle,
    revealedLetters,
    usedLetters,
    score,
    wrongGuesses,
    maxWrongGuesses,
    gameStatus,
    newlyRevealedLetter,
    clueLetters,
    cluesRemaining,
    currentSpinValue,
    hasSpun,
    guessLetter,
    useClue,
    startNewGame,
  } = useGameStore();

  // Redirect to spin page if no spin value
  useEffect(() => {
    if (!hasSpun && gameStatus === "playing") {
      navigate("/");
    }
  }, [hasSpun, gameStatus, navigate]);

  const handleNewGame = () => {
    startNewGame();
    navigate("/");
  };

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
          {/* Spin Value Display */}
          {currentSpinValue !== null && currentSpinValue > 0 && (
            <div className="bg-primary/20 border border-primary rounded-xl px-6 py-3 animate-fade-in">
              <p className="text-xl font-bold text-primary">
                ${currentSpinValue} per letter!
              </p>
            </div>
          )}

          {/* Category */}
          <CategoryCard category={currentPuzzle.category} />

          {/* Letter Board */}
          <div className="w-full max-w-4xl bg-card/30 backdrop-blur border border-border rounded-2xl p-4 sm:p-6">
            <LetterBoard
              phrase={currentPuzzle.phrase}
              revealedLetters={revealedLetters}
              newlyRevealedLetter={newlyRevealedLetter}
            />
          </div>

          {/* Score and Lives */}
          <ScoreBoard
            score={score}
            wrongGuesses={wrongGuesses}
            maxWrongGuesses={maxWrongGuesses}
          />

          {/* Clue Letters */}
          <ClueLetters
            clueLetters={clueLetters}
            onUseClue={useClue}
            cluesRemaining={cluesRemaining}
            disabled={gameStatus !== "playing"}
          />

          {/* Keyboard */}
          <Keyboard
            usedLetters={usedLetters}
            onLetterClick={(letter) => {
              guessLetter(letter);
              // After guessing, go back to spin
              setTimeout(() => {
                if (gameStatus === "playing") {
                  navigate("/");
                }
              }, 600);
            }}
            disabled={gameStatus !== "playing" || !hasSpun}
          />

          {/* Spin Again Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Spin Again
          </Button>
        </main>

        {/* Game Over Modal */}
        <GameStatus
          status={gameStatus}
          phrase={currentPuzzle.phrase}
          onNewGame={handleNewGame}
        />
      </div>
    </div>
  );
};

export default GamePage;
