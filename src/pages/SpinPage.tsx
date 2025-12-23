import { useNavigate } from "react-router-dom";
import { GameHeader } from "@/components/GameHeader";
import SpinningWheel, { WheelSegment } from "@/components/SpinningWheel";
import { useGameStore } from "@/stores/gameStore";
import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Trophy } from "lucide-react";

const COLORS = [
  "#efabff", "#eda2f2", "#dc6bad", "#8c7aa9", "#7192be",
  "#ffb7b2", "#ffdac1", "#e2f0cb", "#b5ead7", "#c7ceea"
];

const getColorForTahap = (tahap: string) => {
  // Simple hash to pick a color
  let hash = 0;
  for (let i = 0; i < tahap.length; i++) {
    hash = tahap.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

const SpinPage = () => {
  const navigate = useNavigate();
  const { questions, selectQuestion, gamePhase, resetGame, timerRemaining, score } = useGameStore();

  useEffect(() => {
    // If no questions (e.g. refresh), go back to setup
    if (questions.length === 0 && gamePhase !== "result") {
      navigate("/");
    }
  }, [questions, navigate, gamePhase]);

  const segments: WheelSegment[] = useMemo(() => {
    const mapped = questions.map((q, index) => ({
      id: index, // We use the current index in the array as the ID for selection
      label: q.id.toString(), // Display the original ID (number)
      color: getColorForTahap(q.tahap || "default")
    }));

    // Fisher-Yates shuffle
    for (let i = mapped.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
    }

    return mapped;
  }, [questions]);

  const handleSpinComplete = (questionIndex: number) => {
    selectQuestion(questionIndex);
    
    // Navigate to game page after a short delay
    setTimeout(() => {
      navigate("/game");
    }, 1000);
  };

  const handleNewGame = () => {
    resetGame();
    navigate("/");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0) return null;

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

        <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
          
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

          <h2 className="text-2xl sm:text-3xl font-display text-foreground text-center">
            Pusing Roda!
          </h2>
          
          <SpinningWheel 
            segments={segments}
            onSpinComplete={handleSpinComplete} 
            disabled={gamePhase !== "spin"}
          />
          
          <p className="text-muted-foreground text-center max-w-md">
            Pusing roda untuk memilih peribahasa seterusnya!
          </p>
        </main>
      </div>
    </div>
  );
};

export default SpinPage;
