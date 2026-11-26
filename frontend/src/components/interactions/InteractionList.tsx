"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import type { Interaction } from "@/types/interaction";

interface InteractionListProps {
  interactions: Interaction[];
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

export function InteractionList({ interactions }: InteractionListProps) {
  const router = useRouter();

  if (interactions.length === 0) {
    return <p className="text-sm text-gray-400">No interactions found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500">
          <th className="py-2 font-medium">Title</th>
          <th className="py-2 font-medium">Type</th>
          <th className="py-2 font-medium">Date</th>
          <th className="py-2 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {interactions.map((interaction) => (
          <tr
            key={interaction.id}
            onClick={() => router.push(`/interactions/${interaction.id}`)}
            className="cursor-pointer transition-colors hover:bg-gray-50"
          >
            <td className="py-3 font-medium text-gray-900">
              {interaction.title ?? "Untitled interaction"}
            </td>
            <td className="py-3">
              <Badge value={interaction.type} />
            </td>
            <td className="py-3 text-gray-500">
              {new Date(interaction.interaction_date).toLocaleString()}
            </td>
            <td className="py-3 text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/interactions/${interaction.id}`);
                }}
                aria-label="View interaction"
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
