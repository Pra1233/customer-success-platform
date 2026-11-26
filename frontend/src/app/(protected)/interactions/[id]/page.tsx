"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">
            {interaction.title ?? "Untitled interaction"}
          </h1>
          <Badge value={interaction.type} />
        </div>
        <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <p className="mb-2 text-xs text-gray-400">
            {new Date(interaction.interaction_date).toLocaleString()}
          </p>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{interaction.notes}</p>
        </Card>

        <Card className="h-fit lg:col-span-2">
          <InsightPanel
            insights={insights}
            isGenerating={insightsStatus === "loading"}
            onGenerate={handleGenerate}
          />
        </Card>
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
