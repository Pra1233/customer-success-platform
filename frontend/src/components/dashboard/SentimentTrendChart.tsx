"use client";

import { useMemo } from "react";

import type { SentimentTrendPoint } from "@/types/dashboard";

interface SentimentTrendChartProps {
  points: SentimentTrendPoint[];
}

const SERIES: Array<{ key: keyof Pick<SentimentTrendPoint, "positive" | "neutral" | "negative">; color: string }> = [
  { key: "positive", color: "#16A34A" },
  { key: "neutral", color: "#D97706" },
  { key: "negative", color: "#DC2626" },
];

const WIDTH = 560;
const HEIGHT = 140;
const PAD = 20;

export function SentimentTrendChart({ points }: SentimentTrendChartProps) {
  const lines = useMemo(() => {
    if (points.length < 2) return null;

    const maxValue = Math.max(1, ...points.flatMap((p) => [p.positive, p.neutral, p.negative]));
    const stepX = (WIDTH - PAD * 2) / (points.length - 1);

    return SERIES.map((series) => {
      const coords = points.map((point, index) => {
        const x = PAD + index * stepX;
        const y = HEIGHT - PAD - (point[series.key] / maxValue) * (HEIGHT - PAD * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      return { ...series, path: coords.join(" ") };
    });
  }, [points]);

  if (!lines) {
    return (
      <p className="font-body text-body-sm text-muted-text">
        Not enough weekly history yet to show a trend line.
      </p>
    );
  }

  return (
    <div className="h-36 w-full">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" role="img" aria-label="Sentiment trends line chart">
        <line x1={0} y1={PAD} x2={WIDTH} y2={PAD} stroke="#E2E8F0" strokeDasharray="4 4" />
        <line x1={0} y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="#E2E8F0" strokeDasharray="4 4" />
        <line x1={0} y1={HEIGHT - PAD} x2={WIDTH} y2={HEIGHT - PAD} stroke="#E2E8F0" />
        {lines.map((line) => (
          <polyline
            key={line.key}
            fill="none"
            stroke={line.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={line.path}
          />
        ))}
      </svg>
    </div>
  );
}
