export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-cv-border/30 via-cv-border/60 to-cv-border/30 bg-[length:200%_100%] rounded ${className}`}
    />
  );
}
