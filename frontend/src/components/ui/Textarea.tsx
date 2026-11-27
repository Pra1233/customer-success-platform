import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className = "", id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="font-label text-label-md text-on-surface">
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          required={required}
          className={`rounded border bg-surface px-3 py-2 font-body text-body-md text-on-surface placeholder:text-muted-text outline-none transition-colors duration-150 ease-out focus:border-primary focus:ring-2 focus:ring-primary-container ${
            error ? "border-danger" : "border-outline-variant"
          } ${className}`}
          {...rest}
        />
        {error && <span className="font-body text-body-sm text-danger">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
