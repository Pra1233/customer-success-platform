"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover disabled:bg-primary/40 focus-visible:ring-primary",
  secondary:
    "bg-surface text-on-surface border border-outline-variant hover:bg-surface-container disabled:text-muted-text focus-visible:ring-primary",
  danger:
    "bg-danger text-on-danger hover:opacity-90 disabled:opacity-40 focus-visible:ring-danger",
  ghost:
    "bg-transparent text-secondary-text hover:bg-surface-container hover:text-on-surface focus-visible:ring-primary",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-label-md gap-1.5",
  md: "h-10 px-4 text-label-lg gap-2",
  lg: "h-12 px-6 text-label-lg gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded font-label font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
