import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchQuestions } from "@/services/csvService";
import { Loader2 } from "lucide-react";

const SetupPage = () => {
  const navigate = useNavigate();
  const { setPlayerName, setTimerDuration, setQuestions, startGame } = useGameStore();
  
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questions = await fetchQuestions();
        if (questions.length === 0) {
          setError("No questions found or error loading CSV.");
        } else {
          setQuestions(questions);
        }
      } catch (err) {
        setError("Failed to load questions.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [setQuestions]);

  const handleStart = () => {
    if (!name.trim()) return;
    setPlayerName(name);
    setTimerDuration(duration);
    startGame();
    navigate("/spin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading Game Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-display text-primary">
            RODA ILMU: PERIBAHASA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nama Pemain</Label>
            <Input
              id="name"
              placeholder="Masukkan nama anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Masa Permainan</Label>
              <span className="text-sm text-muted-foreground">{duration} Minit</span>
            </div>
            <Slider
              value={[duration]}
              onValueChange={(vals) => setDuration(vals[0])}
              min={1}
              max={5}
              step={1}
            />
            <p className="text-xs text-muted-foreground text-right">
              Min: 1 min, Max: 5 min
            </p>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleStart}
            disabled={!name.trim() || !!error}
          >
            Mula Permainan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;
