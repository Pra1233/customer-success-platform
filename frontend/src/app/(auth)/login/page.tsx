"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Card } from "@/components/ui/Card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = status === "loading";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  }

  return (
    <Card className="flex flex-col gap-6 p-8">
      <header className="flex flex-col gap-1.5 text-center">
        <h1 className="font-headline text-headline-md text-on-surface">Sign in to your workspace</h1>
        <p className="font-body text-body-md text-secondary-text">
          Enter your credentials to access customer accounts and AI insights.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="font-body text-body-sm text-danger">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="mt-1 w-full">
          Log in
        </Button>
      </form>

      <footer className="border-t border-outline-variant pt-4 text-center">
        <p className="font-body text-body-md text-secondary-text">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-label text-label-lg text-primary hover:text-primary-hover">
            Register
          </Link>
        </p>
      </footer>
    </Card>
  );
}
