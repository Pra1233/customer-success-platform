"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
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

export function CustomerTable({ customers }: CustomerTableProps) {
  const router = useRouter();

  if (customers.length === 0) {
    return <p className="text-sm text-gray-400">No customers found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500">
          <th className="py-2 font-medium">Name</th>
          <th className="py-2 font-medium">Company</th>
          <th className="py-2 font-medium">Status</th>
          <th className="py-2 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {customers.map((customer) => (
          <tr
            key={customer.id}
            onClick={() => router.push(`/customers/${customer.id}`)}
            className="cursor-pointer transition-colors hover:bg-gray-50"
          >
            <td className="py-3 font-medium text-gray-900">{customer.name}</td>
            <td className="py-3 text-gray-600">{customer.company ?? "—"}</td>
            <td className="py-3">
              <Badge value={customer.status} />
            </td>
            <td className="py-3 text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/customers/${customer.id}`);
                }}
                aria-label="View customer"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
