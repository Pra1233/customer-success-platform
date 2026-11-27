"use client";

import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-6">
      <div className="flex items-center gap-3">
        {user && <Avatar name={user.name} size="sm" />}
        <div className="leading-tight">
          <p className="font-label text-label-lg text-on-surface">{user?.name}</p>
          <p className="font-label text-label-md uppercase tracking-wide text-secondary-text">{user?.role}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Log out
      </Button>
    </header>
  );
}
