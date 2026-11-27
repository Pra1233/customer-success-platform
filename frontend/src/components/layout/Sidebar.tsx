"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

import { Logo } from "@/components/ui/Logo";

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M3 10.5 10 4l7 6.5M5 9v7h4v-4h2v4h4V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CustomersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="7.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.5 16c0-2.8 2.2-5 5-5s5 2.2 5 5M13 6a2.5 2.5 0 1 1 2 4.5M15.5 11.5c1.7.3 3 1.8 3 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InteractionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M3 4h14v9H7l-4 3.5V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/customers", label: "Customers", icon: CustomersIcon },
  { href: "/interactions", label: "Interactions", icon: InteractionsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-outline-variant bg-surface md:flex">
      <div className="flex h-16 items-center border-b border-outline-variant px-5">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex h-10 items-center gap-3 rounded px-3 font-label text-label-lg transition-colors duration-150 ease-out ${
                isActive
                  ? "bg-primary-container text-primary"
                  : "text-secondary-text hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? "text-primary" : "text-muted-text group-hover:text-secondary-text"
                }`}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
