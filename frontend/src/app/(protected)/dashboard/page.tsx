"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { SVGProps } from "react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
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
function PulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M2.5 10h3l2-5 4 10 2-5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (status === "loading" && !data) {
    return <p className="text-sm text-gray-500">Loading dashboard...</p>;
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total customers" value={data.total_customers} tone="brand" icon={UsersIcon} />
        <StatCard label="Total interactions" value={data.total_interactions} tone="gray" icon={ChatIcon} />
        <StatCard
          label="Active customers"
          value={data.customers_by_status.active ?? 0}
          tone="green"
          icon={PulseIcon}
        />
        <StatCard
          label="Negative sentiment alerts"
          value={data.negative_sentiment_alerts.length}
          tone="red"
          icon={AlertIcon}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SentimentChart breakdown={data.sentiment_breakdown} />

        <Card>
          <p className="mb-3 text-sm font-medium text-gray-700">Needs follow-up</p>
          {data.negative_sentiment_alerts.length === 0 ? (
            <p className="text-sm text-gray-400">No negative-sentiment interactions.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.negative_sentiment_alerts.map((alert) => (
                <li key={alert.interaction_id} className="text-sm">
                  <Link
                    href={`/customers/${alert.customer_id}`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {alert.customer_name}
                  </Link>
                  <p className="text-gray-500 line-clamp-1">{alert.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <p className="mb-3 text-sm font-medium text-gray-700">Recent interactions</p>
        {data.recent_interactions.length === 0 ? (
          <p className="text-sm text-gray-400">No interactions yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100">
            {data.recent_interactions.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2">
                <div>
                  <Link
                    href={`/interactions/${item.id}`}
                    className="text-sm font-medium text-brand-600 hover:underline"
                  >
                    {item.title ?? "Untitled interaction"}
                  </Link>
                  <p className="text-xs text-gray-500">{item.customer_name}</p>
                </div>
                <Badge value={item.type} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
