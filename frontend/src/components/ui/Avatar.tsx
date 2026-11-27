import { memo } from "react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

interface AvatarProps {
  name: string;
  size?: Size;
}

export const Avatar = memo(function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary-container font-label font-semibold text-on-primary-container ${sizeClasses[size]}`}
    >
      {getInitials(name)}
    </div>
  );
});
