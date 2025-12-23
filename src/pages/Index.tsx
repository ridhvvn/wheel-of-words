import { GameHeader } from "@/components/GameHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { LetterBoard } from "@/components/LetterBoard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { ClueLetters } from "@/components/ClueLetters";
import { Keyboard } from "@/components/Keyboard";
import { GameStatus } from "@/components/GameStatus";
import SpinningWheel from "@/components/SpinningWheel";
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
    currentSpinValue,
    hasSpun,
    guessLetter,
    useClue,
    startNewGame,
    handleSpinComplete,
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

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 p-4">
          {/* Left side - Spinning Wheel */}
          <div className="flex flex-col items-center gap-4">
            <SpinningWheel 
              onSpinComplete={handleSpinComplete} 
              disabled={gameStatus !== "playing" || hasSpun}
            />
            {hasSpun && currentSpinValue !== null && currentSpinValue > 0 && (
              <div className="text-center animate-fade-in">
                <p className="text-lg font-bold text-primary">
                  ${currentSpinValue} per letter!
                </p>
                <p className="text-sm text-muted-foreground">Pick a letter</p>
              </div>
            )}
            {hasSpun && currentSpinValue === 0 && (
              <div className="text-center animate-fade-in">
                <p className="text-lg font-bold text-destructive">BANKRUPT!</p>
                <p className="text-sm text-muted-foreground">Spin again</p>
              </div>
            )}
          </div>

          {/* Right side - Game Board */}
          <div className="flex flex-col items-center gap-6">
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
              disabled={gameStatus !== "playing" || !hasSpun}
            />
            
            {!hasSpun && gameStatus === "playing" && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Spin the wheel first!
              </p>
            )}
          </div>
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
