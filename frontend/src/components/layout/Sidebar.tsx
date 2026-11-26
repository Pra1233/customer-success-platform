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
    <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-14 items-center border-b border-gray-100 px-4">
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
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-500"
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
