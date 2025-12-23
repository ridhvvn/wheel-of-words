import { create } from "zustand";

interface Puzzle {
  phrase: string;
  category: string;
}

const PUZZLES: Puzzle[] = [
  { phrase: "WHEEL OF FORTUNE", category: "Game Show" },
  { phrase: "BRIGHT LIGHTS BIG CITY", category: "Song Title" },
  { phrase: "PRACTICE MAKES PERFECT", category: "Phrase" },
  { phrase: "THE EARLY BIRD CATCHES THE WORM", category: "Phrase" },
  { phrase: "AROUND THE WORLD IN EIGHTY DAYS", category: "Book Title" },
  { phrase: "BREAK A LEG", category: "Show Biz" },
  { phrase: "NEW YORK CITY", category: "Place" },
  { phrase: "ONCE UPON A TIME", category: "Phrase" },
  { phrase: "ACTIONS SPEAK LOUDER THAN WORDS", category: "Phrase" },
  { phrase: "CALIFORNIA DREAMING", category: "Song Title" },
];

const MAX_WRONG_GUESSES = 6;
const MAX_CLUES = 3;

interface GameState {
  currentPuzzle: Puzzle;
  revealedLetters: Set<string>;
  usedLetters: Set<string>;
  score: number;
  wrongGuesses: number;
  maxWrongGuesses: number;
  gameStatus: "playing" | "won" | "lost";
  newlyRevealedLetter: string | null;
  clueLetters: string[];
  cluesRemaining: number;
  currentSpinValue: number | null;
  hasSpun: boolean;
  
  // Actions
  setSpinValue: (value: number) => void;
  guessLetter: (letter: string) => void;
  useClue: () => void;
  startNewGame: () => void;
  resetSpin: () => void;
}

const getRandomPuzzle = () => {
  const randomIndex = Math.floor(Math.random() * PUZZLES.length);
  return PUZZLES[randomIndex];
};

export const useGameStore = create<GameState>((set, get) => ({
  currentPuzzle: getRandomPuzzle(),
  revealedLetters: new Set<string>(),
  usedLetters: new Set<string>(),
  score: 0,
  wrongGuesses: 0,
  maxWrongGuesses: MAX_WRONG_GUESSES,
  gameStatus: "playing",
  newlyRevealedLetter: null,
  clueLetters: [],
  cluesRemaining: MAX_CLUES,
  currentSpinValue: null,
  hasSpun: false,

  setSpinValue: (value: number) => {
    if (value === 0) {
      // Bankrupt
      set({ score: 0, currentSpinValue: 0, hasSpun: false });
    } else {
      set({ currentSpinValue: value, hasSpun: true });
    }
  },

  guessLetter: (letter: string) => {
    const state = get();
    if (state.gameStatus !== "playing" || state.usedLetters.has(letter) || !state.hasSpun || state.currentSpinValue === null) {
      return;
    }

    const upperLetter = letter.toUpperCase();
    const newUsedLetters = new Set([...state.usedLetters, upperLetter]);

    set({ usedLetters: newUsedLetters, newlyRevealedLetter: upperLetter });
    setTimeout(() => set({ newlyRevealedLetter: null }), 500);

    if (state.currentPuzzle.phrase.toUpperCase().includes(upperLetter)) {
      // Correct guess
      const occurrences = state.currentPuzzle.phrase
        .toUpperCase()
        .split("")
        .filter((l) => l === upperLetter).length;
      const newScore = state.score + state.currentSpinValue * occurrences;
      const newRevealed = new Set([...state.revealedLetters, upperLetter]);

      // Check win condition
      const letters = state.currentPuzzle.phrase.toUpperCase().split("");
      const uniqueLetters = [...new Set(letters.filter((l) => /[A-Z]/.test(l)))];
      const hasWon = uniqueLetters.every((l) => newRevealed.has(l));

      set({
        score: newScore,
        revealedLetters: newRevealed,
        gameStatus: hasWon ? "won" : "playing",
        hasSpun: false,
        currentSpinValue: null,
      });
    } else {
      // Wrong guess
      const newWrongGuesses = state.wrongGuesses + 1;
      set({
        wrongGuesses: newWrongGuesses,
        gameStatus: newWrongGuesses >= MAX_WRONG_GUESSES ? "lost" : "playing",
        hasSpun: false,
        currentSpinValue: null,
      });
    }
  },

  useClue: () => {
    const state = get();
    if (state.cluesRemaining <= 0 || state.gameStatus !== "playing") return;

    const letters = state.currentPuzzle.phrase.toUpperCase().split("");
    const uniqueLetters = [...new Set(letters.filter((l) => /[A-Z]/.test(l)))];
    const unrevealed = uniqueLetters.filter((l) => !state.revealedLetters.has(l));

    if (unrevealed.length === 0) return;

    const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    const newRevealed = new Set([...state.revealedLetters, randomLetter]);
    const newUsedLetters = new Set([...state.usedLetters, randomLetter]);

    // Check win condition
    const hasWon = uniqueLetters.every((l) => newRevealed.has(l));

    set({
      clueLetters: [...state.clueLetters, randomLetter],
      cluesRemaining: state.cluesRemaining - 1,
      usedLetters: newUsedLetters,
      revealedLetters: newRevealed,
      newlyRevealedLetter: randomLetter,
      gameStatus: hasWon ? "won" : "playing",
    });

    setTimeout(() => set({ newlyRevealedLetter: null }), 500);
  },

  startNewGame: () => {
    set({
      currentPuzzle: getRandomPuzzle(),
      revealedLetters: new Set<string>(),
      usedLetters: new Set<string>(),
      score: 0,
      wrongGuesses: 0,
      gameStatus: "playing",
      newlyRevealedLetter: null,
      clueLetters: [],
      cluesRemaining: MAX_CLUES,
      currentSpinValue: null,
      hasSpun: false,
    });
  },

  resetSpin: () => {
    set({ hasSpun: false, currentSpinValue: null });
  },
}));
