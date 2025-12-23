import { Button } from "./ui/button";

interface KeyboardProps {
  usedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export const Keyboard = ({ usedLetters, onLetterClick, disabled }: KeyboardProps) => {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 w-full max-w-3xl">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-0.5 sm:gap-2 justify-center w-full">
          {row.map((letter) => {
            const isUsed = usedLetters.has(letter);
            return (
              <Button
                key={letter}
                variant={isUsed ? "keyboardUsed" : "keyboard"}
                size="key"
                className="keyboard-key"
                onClick={() => onLetterClick(letter)}
                disabled={isUsed || disabled}
              >
                {letter}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
