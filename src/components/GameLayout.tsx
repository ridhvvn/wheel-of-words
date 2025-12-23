import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/gameStore";

export const GameLayout = () => {
  const navigate = useNavigate();
  const { isTimerRunning, timerRemaining, tickTimer, gamePhase } = useGameStore();

  // Global Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining, tickTimer]);

  // Global Navigation Effect based on Game Phase
  useEffect(() => {
    if (gamePhase === "result") {
      navigate("/result");
    }
  }, [gamePhase, navigate]);

  return <Outlet />;
};
