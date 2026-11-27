import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  trailingElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = "", id, trailingElement, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label text-label-md text-on-surface">
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            required={required}
            className={`h-10 w-full rounded border bg-surface px-3 font-body text-body-md text-on-surface placeholder:text-muted-text outline-none transition-colors duration-150 ease-out focus:border-primary focus:ring-2 focus:ring-primary-container ${
              trailingElement ? "pr-10" : ""
            } ${error ? "border-danger" : "border-outline-variant"} ${className}`}
            {...rest}
          />
          {trailingElement && <div className="absolute right-2.5">{trailingElement}</div>}
        </div>
        {error && <span className="font-body text-body-sm text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
