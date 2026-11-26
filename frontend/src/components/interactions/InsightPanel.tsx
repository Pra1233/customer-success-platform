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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">AI insight</h3>
        <Button variant="secondary" size="sm" onClick={onGenerate} isLoading={isGenerating}>
          {latest ? "Regenerate" : "Generate insight"}
        </Button>
      </div>

      {!latest && !isGenerating && (
        <p className="text-sm text-gray-400">No insight generated yet.</p>
      )}

      {latest && latest.status === "failed" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Insight generation failed: {latest.error_message}
        </div>
      )}

      {latest && latest.status === "success" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sentiment:</span>
            {latest.sentiment && <Badge value={latest.sentiment} />}
          </div>
          <p className="text-sm text-gray-700">{latest.summary}</p>

          {latest.action_items && latest.action_items.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500">Action items</p>
              <ul className="ml-4 list-disc text-sm text-gray-700">
                {latest.action_items.map((item, idx) => (
                  <li key={idx}>{item.title}</li>
                ))}
              </ul>
            </div>
          )}

          {latest.risks && latest.risks.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500">Risks</p>
              <ul className="ml-4 list-disc text-sm text-gray-700">
                {latest.risks.map((risk, idx) => (
                  <li key={idx}>
                    {risk.title}{" "}
                    <span className="text-xs text-gray-400">({risk.severity})</span>
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
