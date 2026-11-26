"use client";

import { useMemo } from "react";

import { Card } from "@/components/ui/Card";

const COLORS: Record<string, string> = {
  positive: "bg-green-500",
  neutral: "bg-gray-400",
  negative: "bg-red-500",
};

interface SentimentChartProps {
  breakdown: Record<string, number>;
}

export function SentimentChart({ breakdown }: SentimentChartProps) {
  const total = useMemo(
    () => Object.values(breakdown).reduce((sum, n) => sum + n, 0),
    [breakdown]
  );

  const segments = useMemo(
    () =>
      Object.entries(breakdown).map(([sentiment, count]) => ({
        sentiment,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      })),
    [breakdown, total]
  );

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-gray-700">Sentiment breakdown</p>
      {total === 0 ? (
        <p className="text-sm text-gray-400">No insights generated yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
            {segments.map((s) => (
              <div
                key={s.sentiment}
                className={COLORS[s.sentiment] ?? "bg-gray-300"}
                style={{ width: `${s.pct}%` }}
              />
            ))}
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            {segments.map((s) => (
              <span key={s.sentiment} className="capitalize">
                {s.sentiment}: {s.count} ({s.pct}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
