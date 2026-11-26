"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { CustomerStatus } from "@/types/customer";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: CustomerStatus | "";
  onStatusChange: (value: CustomerStatus | "") => void;
}

export function CustomerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: CustomerFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-56">
        <Input
          id="search"
          placeholder="Search name or company..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-44">
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as CustomerStatus | "")}
        >
          <option value="">All statuses</option>
          <option value="prospect">Prospect</option>
          <option value="active">Active</option>
          <option value="churned">Churned</option>
        </Select>
      </div>
    </div>
  );
}
