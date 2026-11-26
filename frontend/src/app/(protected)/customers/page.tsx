"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCustomers } from "@/store/slices/customersSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { CustomerStatus } from "@/types/customer";

const NewCustomerModal = dynamic(
  () => import("@/components/customers/NewCustomerModal").then((m) => m.NewCustomerModal),
  { ssr: false }
);

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { items, total, status } = useAppSelector((state) => state.customers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "">("");
  const debouncedSearch = useDebounce(search);
  const { offset, limit, page, nextPage, prevPage, reset } = usePagination();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        offset,
        limit,
      })
    );
  }, [dispatch, debouncedSearch, statusFilter, offset, limit]);

  const hasNextPage = offset + limit < total;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
        <Button onClick={() => setIsModalOpen(true)}>New customer</Button>
      </div>

      <Card>
        <div className="mb-4">
          <CustomerFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {status === "loading" ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            <CustomerTable customers={items} />
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                Page {page} · {total} total
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={prevPage} disabled={offset === 0}>
                  Previous
                </Button>
                <Button variant="secondary" size="sm" onClick={nextPage} disabled={!hasNextPage}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {isModalOpen && (
        <NewCustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
