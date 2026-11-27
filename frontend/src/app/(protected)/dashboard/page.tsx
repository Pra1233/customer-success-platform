"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SVGProps } from "react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { SentimentTrendChart } from "@/components/dashboard/SentimentTrendChart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDashboard } from "@/store/slices/dashboardSlice";

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="7.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 16c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3 4h14v9H7l-4 3.5V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function AlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M10 3 2 17h16L10 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 8.5v3M10 14h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const TYPE_BAR_COLOR: Record<string, string> = {
  meeting: "bg-success",
  call: "bg-info",
  email: "bg-primary",
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data, status } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const maxTypeCount = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, ...Object.values(data.interactions_by_type));
  }, [data]);

  if (status === "loading" && !data) {
    return <p className="font-body text-body-md text-secondary-text">Loading dashboard...</p>;
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg text-on-surface">Dashboard</h1>
          <p className="font-body text-body-md text-secondary-text">
            Customer health, interaction volume, and AI-detected sentiment insights across your accounts.
          </p>
        </div>
        <Link href="/interactions" className="self-start sm:self-auto">
          <Button>View interactions</Button>
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button onClick={() => router.push("/customers")} className="cursor-pointer text-left">
          <StatCard
            label="Total customers"
            value={data.total_customers}
            tone="primary"
            icon={UsersIcon}
            deltaPct={data.customer_count_change_pct}
          />
        </button>
        <button onClick={() => router.push("/interactions")} className="cursor-pointer text-left">
          <StatCard label="Total interactions" value={data.total_interactions} tone="info" icon={ChatIcon} />
        </button>
        <button onClick={() => router.push("/interactions")} className="cursor-pointer text-left">
          <StatCard
            label="Negative alerts"
            value={data.negative_sentiment_alerts.length}
            tone="danger"
            icon={AlertIcon}
          />
        </button>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SentimentChart breakdown={data.sentiment_breakdown} />
        </div>

        <Card className="flex flex-col gap-5 lg:col-span-7">
          <div>
            <h2 className="font-title text-title-md text-on-surface">Sentiment Trends &amp; Channel Volume</h2>
            <p className="font-body text-body-sm text-secondary-text">Weekly sentiment trajectory and interaction breakdown</p>
          </div>

          <SentimentTrendChart points={data.sentiment_trend} />

          <div className="grid grid-cols-1 gap-4 border-t border-outline-variant pt-3 sm:grid-cols-3">
            {Object.entries(data.interactions_by_type).map(([type, count]) => (
              <div key={type} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label text-label-md capitalize text-secondary-text">{type}s</span>
                  <span className="font-label text-label-md tabular-nums text-on-surface">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                  <div
                    className={`h-full rounded-full ${TYPE_BAR_COLOR[type] ?? "bg-primary"}`}
                    style={{ width: `${(count / maxTypeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="flex flex-col gap-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-on-surface">Needs Follow-up</h2>
            {data.negative_sentiment_alerts.length > 0 && (
              <span className="rounded-full bg-danger-container px-2.5 py-0.5 font-label text-label-md tabular-nums text-on-danger-container">
                {data.negative_sentiment_alerts.length} alert{data.negative_sentiment_alerts.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
          {data.negative_sentiment_alerts.length === 0 ? (
            <p className="font-body text-body-md text-muted-text">No negative-sentiment interactions.</p>
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant">
              {data.negative_sentiment_alerts.map((alert) => (
                <Link
                  key={alert.interaction_id}
                  href={`/customers/${alert.customer_id}`}
                  className="flex flex-col gap-1 rounded px-2 py-3 -mx-2 transition-colors hover:bg-surface-container-low first:pt-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label text-label-lg text-on-surface">{alert.customer_name}</span>
                    <Badge value="negative" />
                  </div>
                  <p className="line-clamp-1 font-body text-body-sm text-secondary-text">{alert.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-on-surface">Recent Interactions</h2>
            <Link href="/interactions" className="font-label text-label-md text-primary hover:text-primary-hover">
              View all
            </Link>
          </div>
          {data.recent_interactions.length === 0 ? (
            <p className="font-body text-body-md text-muted-text">No interactions yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant">
              {data.recent_interactions.map((item) => (
                <Link
                  key={item.id}
                  href={`/interactions/${item.id}`}
                  className="flex items-center justify-between gap-4 rounded px-2 py-3 -mx-2 transition-colors hover:bg-surface-container-low first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-label text-label-lg text-on-surface">
                      {item.title ?? "Untitled interaction"}
                    </span>
                    <span className="font-body text-body-sm text-secondary-text">{item.customer_name}</span>
                  </div>
                  <Badge value={item.type} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
