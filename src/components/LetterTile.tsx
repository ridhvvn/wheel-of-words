import { cn } from "@/lib/utils";

interface LetterTileProps {
  letter: string;
  isRevealed: boolean;
  isSpace?: boolean;
  isNewlyRevealed?: boolean;
}

export const LetterTile = ({ letter, isRevealed, isSpace, isNewlyRevealed }: LetterTileProps) => {
  if (isSpace) {
    return <div className="letter-tile blank" />;
  }

  return (
    <div
      className={cn(
        "letter-tile",
        isRevealed && "revealed",
        isNewlyRevealed && "animate-reveal"
      )}
    >
      <span
        className={cn(
          "font-display tracking-wider",
          isRevealed ? "text-primary-foreground" : "text-transparent"
        )}
      >
        {letter.toUpperCase()}
      </span>
    </div>
  );
};
