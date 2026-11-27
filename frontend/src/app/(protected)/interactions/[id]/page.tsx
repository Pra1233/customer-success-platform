"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InsightPanel } from "@/components/interactions/InsightPanel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInteraction } from "@/store/slices/interactionsSlice";
import { fetchInsights, generateInsight } from "@/store/slices/insightsSlice";

const EditInteractionModal = dynamic(
  () => import("@/components/interactions/EditInteractionModal").then((m) => m.EditInteractionModal),
  { ssr: false }
);

export default function InteractionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const interaction = useAppSelector((state) => state.interactions.current);
  const insights = useAppSelector((state) => state.insights.byInteractionId[id] ?? []);
  const insightsStatus = useAppSelector((state) => state.insights.status);

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInteraction(id));
    dispatch(fetchInsights(id));
  }, [dispatch, id]);

  const handleGenerate = useCallback(() => {
    dispatch(generateInsight(id));
  }, [dispatch, id]);

  if (!interaction) {
    return <p className="font-body text-body-md text-secondary-text">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline text-headline-md text-on-surface">
              {interaction.title ?? "Untitled interaction"}
            </h1>
            <Badge value={interaction.type} />
          </div>
          {interaction.customer_name && (
            <Link
              href={`/customers/${interaction.customer_id}`}
              className="inline-flex items-center gap-1.5 font-label text-label-lg text-primary hover:text-primary-hover"
            >
              {interaction.customer_name}
              {interaction.customer_company ? ` (${interaction.customer_company})` : ""}
            </Link>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)} className="self-start sm:self-auto">
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Card className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-outline-variant pb-4">
            <h2 className="font-title text-title-md text-on-surface">Original Interaction Notes</h2>
            <span className="font-label text-label-md text-secondary-text">Source record</span>
          </div>
          <p className="font-mono text-mono-sm text-secondary-text">
            {new Date(interaction.interaction_date).toLocaleString()}
          </p>
          <p className="whitespace-pre-wrap font-body text-body-lg leading-relaxed text-on-surface">
            {interaction.notes}
          </p>
        </Card>

        <div className="lg:col-span-5">
          <InsightPanel
            insights={insights}
            isGenerating={insightsStatus === "loading"}
            onGenerate={handleGenerate}
          />
        </div>
      </div>

      {isEditOpen && (
        <EditInteractionModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          interaction={interaction}
        />
      )}
    </div>
  );
}
