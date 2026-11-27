import Link from "next/link";

import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary-container/60 blur-3xl" />
        <div
          className="animate-float-blob absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-primary-container/40 blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="animate-float-blob absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-info-container/40 blur-3xl"
          style={{ animationDelay: "8s" }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" className="animate-fade-in-up">
          <Logo />
        </Link>
        <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
        <p className="animate-fade-in-up font-body text-body-sm text-secondary-text" style={{ animationDelay: "0.15s" }}>
          © 2026 Customer Success Platform
        </p>
      </div>
    </div>
  );
}
