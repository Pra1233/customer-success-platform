"use client";

import { Select } from "@/components/ui/Select";
import type { CustomerSort } from "@/types/customer";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: CustomerSort;
  onSortChange: (value: CustomerSort) => void;
}

export function CustomerFilters({ search, onSearchChange, sort, onSortChange }: CustomerFiltersProps) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-3 rounded-md border border-outline-variant bg-surface p-4 shadow-sm md:flex-row md:items-center">
      <div className="relative flex max-w-md flex-1 items-center">
        <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-muted-text">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="m17 17-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          aria-label="Search customers by name or company"
          placeholder="Search name or company..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded border border-outline-variant bg-surface pl-9 pr-3 font-body text-body-md text-on-surface outline-none transition-colors duration-150 ease-out placeholder:text-muted-text focus:border-primary focus:ring-2 focus:ring-primary-container"
        />
      </div>

      <div className="w-full md:w-56">
        <Select
          aria-label="Sort customers"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as CustomerSort)}
        >
          <option value="last_interaction">Last interaction (Newest)</option>
          <option value="name">Name (A-Z)</option>
          <option value="company">Company (A-Z)</option>
        </Select>
      </div>
    </div>
  );
}
