import { useState, useCallback, useEffect } from "react";

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

const CONSONANT_VALUES = [100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
const MAX_WRONG_GUESSES = 6;
const MAX_CLUES = 3;

export const useWheelOfFortune = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(PUZZLES[0]);
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [newlyRevealedLetter, setNewlyRevealedLetter] = useState<string | null>(null);
  const [clueLetters, setClueLetters] = useState<string[]>([]);
  const [cluesRemaining, setCluesRemaining] = useState(MAX_CLUES);
  const [currentSpinValue, setCurrentSpinValue] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const getRandomPuzzle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * PUZZLES.length);
    return PUZZLES[randomIndex];
  }, []);

  const getUnrevealedLetters = useCallback(() => {
    const letters = currentPuzzle.phrase.toUpperCase().split("");
    const uniqueLetters = [...new Set(letters.filter((l) => /[A-Z]/.test(l)))];
    return uniqueLetters.filter((l) => !revealedLetters.has(l));
  }, [currentPuzzle.phrase, revealedLetters]);

  const checkWinCondition = useCallback(
    (revealed: Set<string>) => {
      const letters = currentPuzzle.phrase.toUpperCase().split("");
      const uniqueLetters = [...new Set(letters.filter((l) => /[A-Z]/.test(l)))];
      return uniqueLetters.every((l) => revealed.has(l));
    },
    [currentPuzzle.phrase]
  );

  const handleSpinComplete = useCallback((value: number) => {
    setCurrentSpinValue(value);
    setHasSpun(true);
    
    if (value === 0) {
      // Bankrupt - lose all points
      setScore(0);
      setHasSpun(false);
    }
  }, []);

  const guessLetter = useCallback(
    (letter: string) => {
      if (gameStatus !== "playing" || usedLetters.has(letter) || !hasSpun || currentSpinValue === null) return;

      const upperLetter = letter.toUpperCase();
      setUsedLetters((prev) => new Set([...prev, upperLetter]));
      setNewlyRevealedLetter(upperLetter);

      // Clear the animation state after animation completes
      setTimeout(() => setNewlyRevealedLetter(null), 500);

      if (currentPuzzle.phrase.toUpperCase().includes(upperLetter)) {
        // Correct guess - use spin value
        const occurrences = currentPuzzle.phrase
          .toUpperCase()
          .split("")
          .filter((l) => l === upperLetter).length;
        setScore((prev) => prev + currentSpinValue * occurrences);

        const newRevealed = new Set([...revealedLetters, upperLetter]);
        setRevealedLetters(newRevealed);

        if (checkWinCondition(newRevealed)) {
          setGameStatus("won");
        }
      } else {
        // Wrong guess
        const newWrongGuesses = wrongGuesses + 1;
        setWrongGuesses(newWrongGuesses);

        if (newWrongGuesses >= MAX_WRONG_GUESSES) {
          setGameStatus("lost");
        }
      }
      
      // Reset spin state after guess
      setHasSpun(false);
      setCurrentSpinValue(null);
    },
    [
      currentPuzzle.phrase,
      gameStatus,
      usedLetters,
      revealedLetters,
      wrongGuesses,
      checkWinCondition,
      hasSpun,
      currentSpinValue,
    ]
  );

  const useClue = useCallback(() => {
    if (cluesRemaining <= 0 || gameStatus !== "playing") return;

    const unrevealed = getUnrevealedLetters();
    if (unrevealed.length === 0) return;

    const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];

    setClueLetters((prev) => [...prev, randomLetter]);
    setCluesRemaining((prev) => prev - 1);
    setUsedLetters((prev) => new Set([...prev, randomLetter]));
    setNewlyRevealedLetter(randomLetter);

    setTimeout(() => setNewlyRevealedLetter(null), 500);

    const newRevealed = new Set([...revealedLetters, randomLetter]);
    setRevealedLetters(newRevealed);

    if (checkWinCondition(newRevealed)) {
      setGameStatus("won");
    }
  }, [cluesRemaining, gameStatus, getUnrevealedLetters, revealedLetters, checkWinCondition]);

  const startNewGame = useCallback(() => {
    setCurrentPuzzle(getRandomPuzzle());
    setRevealedLetters(new Set());
    setUsedLetters(new Set());
    setScore(0);
    setWrongGuesses(0);
    setGameStatus("playing");
    setNewlyRevealedLetter(null);
    setClueLetters([]);
    setCluesRemaining(MAX_CLUES);
    setCurrentSpinValue(null);
    setHasSpun(false);
  }, [getRandomPuzzle]);

  // Initialize with a random puzzle
  useEffect(() => {
    startNewGame();
  }, []);

  return {
    currentPuzzle,
    revealedLetters,
    usedLetters,
    score,
    wrongGuesses,
    maxWrongGuesses: MAX_WRONG_GUESSES,
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
  };
};
