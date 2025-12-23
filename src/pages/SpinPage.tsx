import { useNavigate } from "react-router-dom";
import { GameHeader } from "@/components/GameHeader";
import SpinningWheel from "@/components/SpinningWheel";
import { useGameStore } from "@/stores/gameStore";

const SpinPage = () => {
  const navigate = useNavigate();
  const { setSpinValue, gameStatus, startNewGame } = useGameStore();

  const handleSpinComplete = (value: number) => {
    setSpinValue(value);
    
    if (value === 0) {
      // Bankrupt - stay on spin page
      setTimeout(() => {
        // Allow spinning again after bankrupt
      }, 1500);
    } else {
      // Navigate to game page after a short delay
      setTimeout(() => {
        navigate("/game");
      }, 1000);
    }
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
        <GameHeader onNewGame={startNewGame} />

        <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
          <h2 className="text-2xl sm:text-3xl font-display text-foreground text-center">
            Spin the Wheel!
          </h2>
          
          <SpinningWheel 
            onSpinComplete={handleSpinComplete} 
            disabled={gameStatus !== "playing"}
          />
          
          <p className="text-muted-foreground text-center max-w-md">
            Spin the wheel to determine how much each correct letter is worth!
          </p>
        </main>
      </div>
    </div>
  );
};

export default SpinPage;
