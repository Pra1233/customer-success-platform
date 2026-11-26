"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InteractionList } from "@/components/interactions/InteractionList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInteractions } from "@/store/slices/interactionsSlice";
import { usePagination } from "@/hooks/usePagination";

const NewInteractionModal = dynamic(
  () => import("@/components/interactions/NewInteractionModal").then((m) => m.NewInteractionModal),
  { ssr: false }
);

export default function InteractionsPage() {
  const dispatch = useAppDispatch();
  const { items, total, status } = useAppSelector((state) => state.interactions);
  const { offset, limit, page, nextPage, prevPage } = usePagination();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInteractions({ offset, limit }));
  }, [dispatch, offset, limit]);

  const hasNextPage = offset + limit < total;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Interactions</h1>
        <Button onClick={() => setIsModalOpen(true)}>New interaction</Button>
      </div>

      <Card>
        {status === "loading" ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            <InteractionList interactions={items} />
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
        <NewInteractionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
