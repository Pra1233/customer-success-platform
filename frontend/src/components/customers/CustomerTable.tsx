"use client";

import { useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import type { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M4 10h12m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter();

  if (customers.length === 0) {
    return <p className="font-body text-body-md text-muted-text">No customers found.</p>;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-outline-variant bg-surface-container-low">
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Customer
          </th>
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Company
          </th>
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Email
          </th>
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Last Interaction
          </th>
          <th scope="col" className="px-4 py-3.5 text-right font-label text-label-md uppercase tracking-wider text-secondary-text">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant">
        {customers.map((customer) => (
          <tr
            key={customer.id}
            onClick={() => router.push(`/customers/${customer.id}`)}
            className="cursor-pointer transition-colors duration-150 ease-out hover:bg-surface-container-low"
          >
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={customer.name} size="sm" />
                <span className="font-label text-label-lg text-on-surface">{customer.name}</span>
              </div>
            </td>
            <td className="px-4 py-3.5 font-body text-body-md text-on-surface-variant">
              {customer.company ?? "—"}
            </td>
            <td className="px-4 py-3.5 font-body text-body-md text-secondary-text">{customer.email ?? "—"}</td>
            <td className="px-4 py-3.5 font-body text-body-md tabular-nums text-secondary-text">
              {formatDate(customer.last_interaction_at)}
            </td>
            <td className="px-4 py-3.5 text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/customers/${customer.id}`);
                }}
                aria-label="View customer"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded text-secondary-text transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <ArrowRightIcon className="h-[18px] w-[18px]" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
