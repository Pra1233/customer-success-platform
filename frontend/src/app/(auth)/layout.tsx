import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-white px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-float-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl" />
        <div
          className="animate-float-blob absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="animate-float-blob absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl"
          style={{ animationDelay: "8s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
