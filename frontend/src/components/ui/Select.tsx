import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, className = "", id, children, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label text-label-md text-on-surface">
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            required={required}
            className={`h-10 w-full appearance-none rounded border bg-surface px-3 pr-9 font-label text-label-lg text-on-surface outline-none transition-colors duration-150 ease-out focus:border-primary focus:ring-2 focus:ring-primary-container ${
              error ? "border-danger" : "border-outline-variant"
            } ${className}`}
            {...rest}
          >
            {children}
          </select>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text"
          >
            <path
              d="m5 7.5 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {error && <span className="font-body text-body-sm text-danger">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";
