"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Card } from "@/components/ui/Card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError("Passwords don't match");
      return;
    }
    setConfirmError(null);
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  }

  return (
    <Card className="flex flex-col gap-6 p-8">
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="font-headline text-headline-md text-on-surface">Create your account</h1>
        <p className="font-body text-body-md text-secondary-text">
          Set up your Customer Success Platform workspace in seconds.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Work email"
          type="email"
          placeholder="jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <PasswordInput
          id="confirm-password"
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmError(null);
          }}
          error={confirmError ?? undefined}
          required
        />
        {error && <p className="font-body text-body-sm text-danger">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="mt-1 w-full">
          Create account
        </Button>
      </form>

      <footer className="border-t border-outline-variant pt-4 text-center">
        <p className="font-body text-body-md text-secondary-text">
          Already have an account?{" "}
          <Link href="/login" className="font-label text-label-lg text-primary hover:text-primary-hover">
            Log in
          </Link>
        </p>
      </footer>
    </Card>
  );
}
