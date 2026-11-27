"use client";

import { Select } from "@/components/ui/Select";
import type { InteractionType } from "@/types/interaction";
import type { Sentiment } from "@/types/insight";

interface InteractionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: InteractionType | "";
  onTypeChange: (value: InteractionType | "") => void;
  sentiment: Sentiment | "";
  onSentimentChange: (value: Sentiment | "") => void;
}

export function InteractionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  sentiment,
  onSentimentChange,
}: InteractionFiltersProps) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-3 rounded-md border border-outline-variant bg-surface p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="relative flex max-w-md flex-1 items-center">
        <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-muted-text">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="m17 17-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          aria-label="Search interactions"
          placeholder="Search interaction title or customer..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded border border-outline-variant bg-surface pl-9 pr-3 font-body text-body-md text-on-surface outline-none transition-colors duration-150 ease-out placeholder:text-muted-text focus:border-primary focus:ring-2 focus:ring-primary-container"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-40">
          <Select
            aria-label="Filter by interaction type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as InteractionType | "")}
          >
            <option value="">All types</option>
            <option value="meeting">Meeting</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
          </Select>
        </div>
        <div className="w-full sm:w-44">
          <Select
            aria-label="Filter by sentiment"
            value={sentiment}
            onChange={(e) => onSentimentChange(e.target.value as Sentiment | "")}
          >
            <option value="">All sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
