interface CategoryCardProps {
  category: string;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full" />
      <div className="relative bg-card border-2 border-secondary rounded-xl px-6 py-3 sm:px-8 sm:py-4 neon-border">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
          Category
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-secondary tracking-wider">
          {category}
        </h2>
      </div>
    </div>
  );
};
