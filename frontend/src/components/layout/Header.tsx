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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {user && <Avatar name={user.name} size="sm" />}
        <div className="leading-tight">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs uppercase tracking-wide text-gray-400">{user?.role}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Log out
      </Button>
    </header>
  );
}
