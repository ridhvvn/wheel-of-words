import { create } from "zustand";
import { Question } from "../services/csvService";
import { soundManager } from "../lib/sounds";

interface GameState {
  playerName: string;
  timerDuration: number; // in seconds
  timerRemaining: number; // in seconds
  isTimerRunning: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  questionsPassed: number;
  gamePhase: "setup" | "spin" | "play" | "result";
  
  // Current Question State
  revealedLetters: Set<string>;
  usedLetters: Set<string>;
  wrongGuesses: number; // For current question
  
  // Actions
  setPlayerName: (name: string) => void;
  setTimerDuration: (minutes: number) => void;
  setQuestions: (questions: Question[]) => void;
  startGame: () => void;
  spinWheel: () => void;
  selectQuestion: (index: number) => void;
  completeCurrentQuestion: () => void;
  guessLetter: (letter: string) => void;
  tickTimer: () => void;
  resetGame: () => void;
  nextQuestion: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: "",
  timerDuration: 180, // Default 3 minutes
  timerRemaining: 180,
  isTimerRunning: false,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  questionsPassed: 0,
  gamePhase: "setup",
  
  revealedLetters: new Set<string>(),
  usedLetters: new Set<string>(),
  wrongGuesses: 0,

  setPlayerName: (name) => set({ playerName: name }),
  
  setTimerDuration: (minutes) => {
    const seconds = minutes * 60;
    set({ timerDuration: seconds, timerRemaining: seconds });
  },
  
  setQuestions: (questions) => set({ questions }),
  
  startGame: () => {
    const state = get();
    // We don't shuffle anymore, we keep the order from CSV to match IDs if needed, 
    // or we can shuffle but we rely on the wheel to pick.
    // Let's keep them as is so the wheel segments are consistent with IDs if we want.
    // But if we want the wheel to be random, we can shuffle.
    // The user said "wheel will show all numbers of peribahasa".
    // If we have 100 questions, showing 100 segments is hard.
    // Assuming reasonable number.
    
    set({ 
      questions: [...state.questions], // Keep original order or whatever was loaded
      currentQuestionIndex: -1, // No question selected yet
      gamePhase: "spin",
      score: 0,
      questionsPassed: 0,
      timerRemaining: state.timerDuration,
      isTimerRunning: false,
      revealedLetters: new Set<string>(),
      usedLetters: new Set<string>(),
      wrongGuesses: 0
    });
  },
  
  spinWheel: () => {
    // Just sets phase? No, spin happens on SpinPage.
    // This might not be needed if we handle it in component.
  },

  selectQuestion: (questionIndex: number) => {
    set({
      currentQuestionIndex: questionIndex,
      gamePhase: "play",
      isTimerRunning: true,
      revealedLetters: new Set<string>(),
      usedLetters: new Set<string>(),
      wrongGuesses: 0
    });
  },
  
  guessLetter: (letter: string) => {
    const state = get();
    if (state.gamePhase !== "play") return;
    
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const upperLetter = letter.toUpperCase();
    if (state.usedLetters.has(upperLetter)) return;

    const newUsedLetters = new Set([...state.usedLetters, upperLetter]);
    
    const phrase = currentQuestion.peribahasa.toUpperCase();
    
    if (phrase.includes(upperLetter)) {
      const newRevealed = new Set([...state.revealedLetters, upperLetter]);
      
      // Check if completed
      const letters = phrase.split("");
      const uniqueLetters = [...new Set(letters.filter((l) => /[A-Z]/.test(l)))];
      const isComplete = uniqueLetters.every((l) => newRevealed.has(l));
      
      if (isComplete) {
        soundManager.playCorrectGuess();
        // Question completed
        // Remove the question from the list?
        // If we remove it, the indices change.
        // Better to mark it as done or just remove it and handle indices carefully.
        // If we remove it, we need to make sure we don't break the "currentQuestionIndex".
        
        const newQuestions = state.questions.filter((_, i) => i !== state.currentQuestionIndex);
        
        set({
          revealedLetters: newRevealed,
          usedLetters: newUsedLetters,
          score: state.score + currentQuestion.markah,
          questionsPassed: state.questionsPassed + 1,
          // Don't update questions yet, wait for nextQuestion
        });
        
        setTimeout(() => {
           state.completeCurrentQuestion();
        }, 1500);
      } else {
        set({
          revealedLetters: newRevealed,
          usedLetters: newUsedLetters,
        });
      }
    } else {
      // Wrong guess
      soundManager.playWrongGuess();
      set({
        usedLetters: newUsedLetters,
        score: state.score - 5, // Minus 5 points
        wrongGuesses: state.wrongGuesses + 1
      });
    }
  },
  
  completeCurrentQuestion: () => {
    const state = get();
    // Remove the current question from the available list
    const newQuestions = state.questions.filter((_, i) => i !== state.currentQuestionIndex);
    
    if (newQuestions.length === 0) {
      set({ gamePhase: "result", isTimerRunning: false, questions: [] });
    } else {
      set({ 
        questions: newQuestions,
        currentQuestionIndex: -1, 
        gamePhase: "spin" 
      });
    }
  },
  
  nextQuestion: () => {
    // Deprecated in favor of completeCurrentQuestion logic
  },
  
  tickTimer: () => {
    const state = get();
    if (!state.isTimerRunning) return;
    
    const newTime = state.timerRemaining - 1;
    
    if (newTime <= 0) {
      soundManager.playTimerEnd();
      set({ timerRemaining: 0, isTimerRunning: false, gamePhase: "result" });
    } else {
      set({ timerRemaining: newTime });
    }
  },
  
  resetGame: () => {
    set({
      gamePhase: "setup",
      isTimerRunning: false,
      score: 0,
      questionsPassed: 0,
      timerRemaining: get().timerDuration,
      revealedLetters: new Set<string>(),
      usedLetters: new Set<string>(),
      wrongGuesses: 0
    });
  }
}));
