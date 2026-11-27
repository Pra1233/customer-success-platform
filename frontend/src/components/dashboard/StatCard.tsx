import { memo, type SVGProps } from "react";

import { Card } from "@/components/ui/Card";

type Tone = "primary" | "success" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary-container text-primary",
  success: "bg-success-container text-on-success-container",
  danger: "bg-danger-container text-on-danger-container",
  info: "bg-info-container text-on-info-container",
};

interface StatCardProps {
  label: string;
  value: number | string;
  tone?: Tone;
  icon?: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  /** Optional signed percentage change, e.g. "+14%". Omitted entirely when there's
   * no real prior-period data to compare against, rather than showing a fake 0%. */
  deltaPct?: number | null;
  /** Secondary text shown instead of a delta badge, e.g. "83% active". */
  caption?: string;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  tone = "primary",
  icon: Icon,
  deltaPct,
  caption,
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-label text-label-md text-secondary-text">{label}</span>
        {Icon && (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded ${toneClasses[tone]}`}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="font-headline text-headline-lg tabular-nums text-on-surface">{value}</span>
        {typeof deltaPct === "number" && (
          <span
            className={`rounded-full px-2 py-0.5 font-label text-label-md tabular-nums ${
              deltaPct >= 0
                ? "bg-success-container text-on-success-container"
                : "bg-danger-container text-on-danger-container"
            }`}
          >
            {deltaPct >= 0 ? "+" : ""}
            {deltaPct}%
          </span>
        )}
        {caption && <span className="font-body text-body-sm text-secondary-text">{caption}</span>}
      </div>
    </Card>
  );
});
