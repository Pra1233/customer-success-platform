interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-md border border-outline-variant bg-surface p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}
