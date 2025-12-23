import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RotateCcw } from "lucide-react";

const ResultPage = () => {
  const navigate = useNavigate();
  const { playerName, score, questionsPassed, resetGame } = useGameStore();

  const handlePlayAgain = () => {
    resetGame();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display">Tamat Permainan!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">Pemain</p>
            <p className="text-2xl font-bold">{playerName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Markah Terkumpul</p>
              <p className="text-3xl font-bold text-primary">{score}</p>
            </div>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Soalan Dijawab</p>
              <p className="text-3xl font-bold text-primary">{questionsPassed}</p>
            </div>
          </div>

          <Button className="w-full gap-2" size="lg" onClick={handlePlayAgain}>
            <RotateCcw className="w-4 h-4" />
            Main Semula
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultPage;
