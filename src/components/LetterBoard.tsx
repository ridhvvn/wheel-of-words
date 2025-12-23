import { LetterTile } from "./LetterTile";

interface LetterBoardProps {
  phrase: string;
  revealedLetters: Set<string>;
  newlyRevealedLetter: string | null;
}

export const LetterBoard = ({ phrase, revealedLetters, newlyRevealedLetter }: LetterBoardProps) => {
  const words = phrase.split(" ");

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4 sm:p-6 md:p-8">
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="flex gap-1 sm:gap-2">
          {word.split("").map((letter, letterIndex) => {
            const isLetter = /[a-zA-Z]/.test(letter);
            const upperLetter = letter.toUpperCase();
            const isRevealed = !isLetter || revealedLetters.has(upperLetter);
            const isNewlyRevealed = upperLetter === newlyRevealedLetter?.toUpperCase();

            return (
              <LetterTile
                key={`${wordIndex}-${letterIndex}`}
                letter={letter}
                isRevealed={isRevealed}
                isSpace={false}
                isNewlyRevealed={isNewlyRevealed}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
