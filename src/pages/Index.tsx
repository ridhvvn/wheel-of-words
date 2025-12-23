import { GameHeader } from "@/components/GameHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { LetterBoard } from "@/components/LetterBoard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { ClueLetters } from "@/components/ClueLetters";
import { Keyboard } from "@/components/Keyboard";
import { GameStatus } from "@/components/GameStatus";
import { useWheelOfFortune } from "@/hooks/useWheelOfFortune";

const Index = () => {
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
    guessLetter,
    useClue,
    startNewGame,
  } = useWheelOfFortune();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <GameHeader onNewGame={startNewGame} />

        <main className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 p-4">
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
            onLetterClick={guessLetter}
            disabled={gameStatus !== "playing"}
          />
        </main>

        {/* Game Over Modal */}
        <GameStatus
          status={gameStatus}
          phrase={currentPuzzle.phrase}
          onNewGame={startNewGame}
        />
      </div>
    </div>
  );
};

export default Index;
