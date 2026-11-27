interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
}

export function Logo({ variant = "full", className = "" }: LogoProps) {
  const mark = (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-gradient)" />
      <path
        d="M10 20.5c0-3.5 2.7-6.3 6-6.3s6 2.8 6 6.3"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="10.8" r="3.1" fill="white" />
    </svg>
  );

  if (variant === "mark") return <div className={className}>{mark}</div>;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {mark}
      <span className="font-title text-title-md leading-tight text-on-surface">
        Customer Success
        <span className="block font-label text-label-md leading-tight text-secondary-text">Platform</span>
      </span>
    </div>
  );
}
