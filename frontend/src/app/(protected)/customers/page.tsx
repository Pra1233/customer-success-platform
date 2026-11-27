"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/Button";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCustomers } from "@/store/slices/customersSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { CustomerSort } from "@/types/customer";

const NewCustomerModal = dynamic(
  () => import("@/components/customers/NewCustomerModal").then((m) => m.NewCustomerModal),
  { ssr: false }
);

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { items, total, status } = useAppSelector((state) => state.customers);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CustomerSort>("last_interaction");
  const debouncedSearch = useDebounce(search);
  const { offset, limit, page, nextPage, prevPage, reset } = usePagination();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sort]);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        search: debouncedSearch || undefined,
        sort,
        offset,
        limit,
      })
    );
  }, [dispatch, debouncedSearch, sort, offset, limit]);

  const hasNextPage = offset + limit < total;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg text-on-surface">Customers</h1>
          <p className="font-body text-body-md text-secondary-text">
            Manage customer contacts, company accounts, and interaction history.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="self-start sm:self-auto">
          New customer
        </Button>
      </div>

      <CustomerFilters search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} />

      <div className="overflow-hidden rounded-md border border-outline-variant bg-surface shadow-sm">
        <div className="overflow-x-auto">
          {status === "loading" ? (
            <p className="p-4 font-body text-body-md text-secondary-text">Loading...</p>
          ) : (
            <CustomerTable customers={items} />
          )}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline-variant px-6 py-3.5 sm:flex-row">
          <span className="font-body text-body-sm tabular-nums text-secondary-text">
            Page {page} · {total} total customer{total === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={prevPage} disabled={offset === 0}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" onClick={nextPage} disabled={!hasNextPage}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
