"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/Button";
import { InteractionFilters } from "@/components/interactions/InteractionFilters";
import { InteractionList } from "@/components/interactions/InteractionList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInteractions } from "@/store/slices/interactionsSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { InteractionType } from "@/types/interaction";
import type { Sentiment } from "@/types/insight";

const NewInteractionModal = dynamic(
  () => import("@/components/interactions/NewInteractionModal").then((m) => m.NewInteractionModal),
  { ssr: false }
);

export default function InteractionsPage() {
  const dispatch = useAppDispatch();
  const { items, total, status } = useAppSelector((state) => state.interactions);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<InteractionType | "">("");
  const [sentiment, setSentiment] = useState<Sentiment | "">("");
  const debouncedSearch = useDebounce(search);
  const { offset, limit, page, nextPage, prevPage, reset } = usePagination();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, type, sentiment]);

  useEffect(() => {
    dispatch(
      fetchInteractions({
        search: debouncedSearch || undefined,
        type: type || undefined,
        sentiment: sentiment || undefined,
        offset,
        limit,
      })
    );
  }, [dispatch, debouncedSearch, type, sentiment, offset, limit]);

  const hasNextPage = offset + limit < total;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg text-on-surface">Interactions</h1>
          <p className="font-body text-body-md text-secondary-text">
            Track meetings, calls, and emails with AI-analyzed sentiment and action items.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="self-start sm:self-auto">
          New interaction
        </Button>
      </div>

      <InteractionFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        sentiment={sentiment}
        onSentimentChange={setSentiment}
      />

      <div className="overflow-hidden rounded-md border border-outline-variant bg-surface shadow-sm">
        <div className="overflow-x-auto">
          {status === "loading" ? (
            <p className="p-4 font-body text-body-md text-secondary-text">Loading...</p>
          ) : (
            <InteractionList interactions={items} showCustomer />
          )}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline-variant px-6 py-3.5 sm:flex-row">
          <span className="font-body text-body-sm tabular-nums text-secondary-text">
            Page {page} · {total} total interaction{total === 1 ? "" : "s"}
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
        <NewInteractionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
