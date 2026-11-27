"use client";

import { useMemo } from "react";

import { Card } from "@/components/ui/Card";

const ORDER = ["positive", "neutral", "negative"] as const;

const STROKE_COLOR: Record<string, string> = {
  positive: "#16A34A",
  neutral: "#D97706",
  negative: "#DC2626",
};

const DOT_COLOR: Record<string, string> = {
  positive: "bg-success",
  neutral: "bg-warning",
  negative: "bg-danger",
};

interface SentimentChartProps {
  breakdown: Record<string, number>;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SentimentChart({ breakdown }: SentimentChartProps) {
  const total = useMemo(
    () => Object.values(breakdown).reduce((sum, n) => sum + n, 0),
    [breakdown]
  );

  const segments = useMemo(() => {
    return ORDER.reduce<Array<{ sentiment: string; count: number; pct: number; dash: number; offset: number }>>(
      (acc, sentiment) => {
        const count = breakdown[sentiment] ?? 0;
        const pct = total > 0 ? count / total : 0;
        const dash = pct * CIRCUMFERENCE;
        const cumulativeOffset = acc.length > 0 ? acc[acc.length - 1].offset - acc[acc.length - 1].dash : 0;
        acc.push({ sentiment, count, pct: Math.round(pct * 100), dash, offset: cumulativeOffset });
        return acc;
      },
      []
    );
  }, [breakdown, total]);

  return (
    <Card>
      <h2 className="font-title text-title-md text-on-surface">Sentiment Distribution</h2>
      <p className="font-body text-body-sm text-secondary-text">AI-classified tone across interactions</p>

      {total === 0 ? (
        <p className="mt-4 font-body text-body-sm text-muted-text">No insights generated yet.</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-40 w-40 shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Sentiment distribution donut chart">
              <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#F1F5F9" strokeWidth="14" />
              {segments
                .filter((s) => s.count > 0)
                .map((s) => (
                  <circle
                    key={s.sentiment}
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke={STROKE_COLOR[s.sentiment]}
                    strokeWidth="14"
                    strokeDasharray={`${s.dash} ${CIRCUMFERENCE}`}
                    strokeDashoffset={s.offset}
                  />
                ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-headline text-headline-md tabular-nums text-on-surface">{total}</span>
              <span className="font-label text-label-md text-secondary-text">Total</span>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col gap-3">
            {segments.map((s) => (
              <div key={s.sentiment} className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-label text-label-lg capitalize text-on-surface">
                  <span className={`h-2.5 w-2.5 rounded-full ${DOT_COLOR[s.sentiment]}`} />
                  {s.sentiment}
                </span>
                <span className="whitespace-nowrap font-label text-label-lg tabular-nums text-on-surface">
                  {s.count} <span className="font-body text-secondary-text">({s.pct}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
