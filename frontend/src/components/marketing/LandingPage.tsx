import Link from "next/link";
import type { SVGProps } from "react";

import { Logo } from "@/components/ui/Logo";

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="7.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 16c0-2.8 2.2-5 5-5s5 2.2 5 5M13 6a2.5 2.5 0 1 1 2 4.5M15.5 11.5c1.7.3 3 1.8 3 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function SmileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 12c.8.9 1.9 1.4 3 1.4s2.2-.5 3-1.4M7.5 8h.01M12.5 8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ChecklistIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3.5 5.5 5 7l2.5-2.5M3.5 11.5 5 13l2.5-2.5M10.5 5.5h6M10.5 10.5h6M10.5 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M3.5 16.5v-5M9 16.5v-9M14.5 16.5v-3M3 16.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.2l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const features = [
  { icon: UsersIcon, tone: "bg-primary-container text-primary", title: "Customer Management", body: "Maintain clean customer profiles, company records, account status, and complete interaction histories in one directory." },
  { icon: ChatIcon, tone: "bg-info-container text-on-info-container", title: "Interaction Tracking", body: "Log meetings, calls, and emails with structured timestamps and searchable conversation notes." },
  { icon: SparkleIcon, tone: "bg-primary-container text-primary", title: "AI-Powered Insights", body: "Generate concise summaries, risks, and action items from raw interaction notes without altering the source record." },
  { icon: SmileIcon, tone: "bg-success-container text-on-success-container", title: "Sentiment Analysis", body: "Classify interactions as Positive, Neutral, or Negative and surface negative-sentiment alerts on your dashboard." },
  { icon: ChecklistIcon, tone: "bg-warning-container text-on-warning-container", title: "Intelligent Follow-ups", body: "Extract concrete action items so commitments made on calls don't get lost." },
  { icon: ChartIcon, tone: "bg-primary-container text-primary", title: "Customer Analytics", body: "Track sentiment distribution, interaction volume by channel, and weekly sentiment trends in one view." },
];

const solutions = [
  { title: "Customer information scattered across interactions", body: "Emails, call notes, and meeting summaries live in separate tools, forcing teams to piece together context before every call.", solution: "A unified customer timeline with every meeting, call, and email" },
  { title: "Negative sentiment detected too late", body: "Subtle frustration in technical calls or support threads often goes unnoticed until it's already a problem.", solution: "Automatic sentiment classification and real-time risk alerts" },
  { title: "Manual analysis of customer conversations", body: "Reading through notes and summarizing key takeaways consumes hours that teams should spend with customers.", solution: "One-click AI summaries that keep the source notes intact" },
  { title: "Missed follow-ups and action items", body: "Commitments made during calls slip through the cracks without structured task extraction.", solution: "Extracted action items so nothing gets overlooked" },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            <a href="#features" className="font-label text-label-lg text-secondary-text transition-colors hover:text-on-surface">
              Features
            </a>
            <a href="#solutions" className="font-label text-label-lg text-secondary-text transition-colors hover:text-on-surface">
              Solutions
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden h-10 items-center justify-center rounded px-4 font-label text-label-lg text-on-surface transition-colors hover:bg-surface-container sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-4 font-label text-label-lg text-on-primary transition-colors hover:bg-primary-hover"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-outline-variant bg-surface py-16 lg:py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-3 py-1 text-on-primary-container">
              <SparkleIcon className="h-4 w-4" />
              <span className="font-label text-label-md">AI-Powered Customer Intelligence</span>
            </div>
            <h1 className="font-display text-display-lg-mobile text-balance text-on-surface lg:text-display-lg">
              Turn Every Customer Interaction Into Actionable Intelligence
            </h1>
            <p className="max-w-prose font-body text-body-lg text-secondary-text">
              Track customers and interactions, and let AI turn raw meeting notes into summaries, sentiment, and
              action items, automatically.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-5 font-label text-label-lg text-on-primary transition-colors hover:bg-primary-hover"
              >
                Get started
              </Link>
              <a
                href="#features"
                className="inline-flex h-10 items-center justify-center gap-2 rounded border border-outline-variant bg-surface px-5 font-label text-label-lg text-on-surface transition-colors hover:bg-surface-container"
              >
                Explore features
              </a>
            </div>
          </div>
        </section>

        <section id="solutions" className="border-b border-outline-variant bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-2xl">
              <h2 className="mb-3 text-balance font-headline text-headline-lg text-on-surface">
                Built to solve the daily friction of customer success teams
              </h2>
              <p className="text-pretty font-body text-body-lg text-secondary-text">
                Replace fragmented spreadsheets and manual call notes with one workspace that surfaces sentiment
                shifts and next steps automatically.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {solutions.map((item) => (
                <article key={item.title} className="flex flex-col gap-3 rounded-md border border-outline-variant bg-surface p-6">
                  <h3 className="font-title text-title-lg text-on-surface">{item.title}</h3>
                  <p className="font-body text-body-md text-secondary-text">{item.body}</p>
                  <div className="mt-auto flex items-center gap-2 border-t border-outline-variant pt-3 text-primary">
                    <CheckCircleIcon className="h-[18px] w-[18px] shrink-0" />
                    <span className="font-label text-label-lg">{item.solution}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-outline-variant bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-2xl">
              <h2 className="mb-3 text-balance font-headline text-headline-lg text-on-surface">
                Everything needed to run proactive customer success
              </h2>
              <p className="text-pretty font-body text-body-lg text-secondary-text">
                Core CRM structure paired with focused AI analysis across every customer touchpoint.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="flex flex-col gap-3 rounded-md border border-outline-variant bg-background p-6">
                  <div className={`flex h-10 w-10 items-center justify-center rounded ${feature.tone}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-title text-title-lg text-on-surface">{feature.title}</h3>
                  <p className="font-body text-body-md text-secondary-text">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface py-16 lg:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <h2 className="text-balance font-headline text-headline-lg text-on-surface">
              Build Stronger Customer Relationships With Intelligence
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-6 font-label text-label-lg text-on-primary transition-colors hover:bg-primary-hover"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded border border-outline-variant bg-surface px-5 font-label text-label-lg text-on-surface transition-colors hover:bg-surface-container"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <Logo />
          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer navigation">
            <a href="#features" className="font-body text-body-sm text-secondary-text hover:text-on-surface">
              Features
            </a>
            <a href="#solutions" className="font-body text-body-sm text-secondary-text hover:text-on-surface">
              Solutions
            </a>
          </nav>
          <p className="font-body text-body-sm text-secondary-text">
            © 2026 Customer Success Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
