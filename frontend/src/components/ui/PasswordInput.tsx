"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";

type InputProps = React.ComponentProps<typeof Input>;

export function PasswordInput(props: Omit<InputProps, "type" | "trailingElement">) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      trailingElement={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className="cursor-pointer rounded p-1 text-muted-text transition-colors hover:text-on-surface"
        >
          {visible ? (
            <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
              <path
                d="M3 3l14 14M8.3 8.4a2.5 2.5 0 0 0 3.3 3.3M6.1 6.3C4 7.6 2.5 9.5 2 10c1.3 2.2 4.1 5 8 5 1.4 0 2.6-.3 3.7-.9M10 5c4 0 6.8 2.8 8 5-.3.5-.9 1.4-1.7 2.3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
              <path
                d="M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      }
    />
  );
}
