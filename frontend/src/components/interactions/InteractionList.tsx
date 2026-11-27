"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import type { Interaction } from "@/types/interaction";

interface InteractionListProps {
  interactions: Interaction[];
  showCustomer?: boolean;
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

export function InteractionList({ interactions, showCustomer = false }: InteractionListProps) {
  const router = useRouter();

  if (interactions.length === 0) {
    return <p className="font-body text-body-md text-muted-text">No interactions found.</p>;
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-outline-variant bg-surface-container-low">
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Title
          </th>
          {showCustomer && (
            <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
              Customer
            </th>
          )}
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Type
          </th>
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Date
          </th>
          <th scope="col" className="px-4 py-3.5 font-label text-label-md uppercase tracking-wider text-secondary-text">
            Sentiment
          </th>
          <th scope="col" className="px-4 py-3.5 text-right font-label text-label-md uppercase tracking-wider text-secondary-text">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant">
        {interactions.map((interaction) => (
          <tr
            key={interaction.id}
            onClick={() => router.push(`/interactions/${interaction.id}`)}
            className="cursor-pointer transition-colors duration-150 ease-out hover:bg-surface-container-low"
          >
            <td className="px-4 py-3.5 font-label text-label-lg text-on-surface">
              {interaction.title ?? "Untitled interaction"}
            </td>
            {showCustomer && (
              <td className="px-4 py-3.5 font-body text-body-md text-on-surface-variant">
                {interaction.customer_name}
                {interaction.customer_company ? ` · ${interaction.customer_company}` : ""}
              </td>
            )}
            <td className="px-4 py-3.5">
              <Badge value={interaction.type} />
            </td>
            <td className="px-4 py-3.5 font-mono text-mono-sm tabular-nums text-secondary-text">
              {new Date(interaction.interaction_date).toLocaleString()}
            </td>
            <td className="px-4 py-3.5">
              {interaction.sentiment ? <Badge value={interaction.sentiment} /> : <span className="text-muted-text">—</span>}
            </td>
            <td className="px-4 py-3.5 text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/interactions/${interaction.id}`);
                }}
                aria-label="View interaction"
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
