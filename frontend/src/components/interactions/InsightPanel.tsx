"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Insight } from "@/types/insight";

interface InsightPanelProps {
  insights: Insight[];
  isGenerating: boolean;
  onGenerate: () => void;
}

export function InsightPanel({ insights, isGenerating, onGenerate }: InsightPanelProps) {
  const latest = insights[0];

  return (
    <div className="flex flex-col gap-4 rounded-md border border-primary/20 bg-primary-container/40 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-primary/15 pb-4">
        <h3 className="font-title text-title-md text-on-surface">AI insight</h3>
        <Button variant="secondary" size="sm" onClick={onGenerate} isLoading={isGenerating}>
          {latest ? "Regenerate" : "Generate insight"}
        </Button>
      </div>

      {!latest && !isGenerating && (
        <p className="font-body text-body-md text-muted-text">No insight generated yet.</p>
      )}

      {latest && latest.status === "failed" && (
        <div className="rounded border border-danger/30 bg-danger-container p-3 font-body text-body-sm text-on-danger-container">
          Insight generation failed: {latest.error_message}
        </div>
      )}

      {latest && latest.status === "success" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-label text-label-md text-on-primary-container">Sentiment</span>
            {latest.sentiment && <Badge value={latest.sentiment} />}
          </div>

          <p className="font-body text-body-md leading-relaxed text-on-surface">{latest.summary}</p>

          {latest.action_items && latest.action_items.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-primary/15 pt-3">
              <span className="font-label text-label-md text-on-primary-container">Action items</span>
              <ul className="flex flex-col gap-2">
                {latest.action_items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 rounded border border-outline-variant bg-surface p-3">
                    <span className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-sm border-2 border-primary" />
                    <span className="font-body text-body-md text-on-surface">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {latest.risks && latest.risks.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-primary/15 pt-3">
              <span className="font-label text-label-md text-on-primary-container">Risks</span>
              <ul className="flex flex-col gap-2">
                {latest.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 rounded border border-outline-variant bg-surface p-3">
                    <span className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-sm border-2 border-danger" />
                    <span className="font-body text-body-md text-on-surface">
                      {risk.title} <span className="font-label text-label-md text-secondary-text">({risk.severity})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
