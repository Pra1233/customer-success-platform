import { memo, type SVGProps } from "react";

import { Card } from "@/components/ui/Card";

type Tone = "brand" | "green" | "red" | "gray";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-gray-100 text-gray-500",
};

interface StatCardProps {
  label: string;
  value: number | string;
  tone?: Tone;
  icon?: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  tone = "brand",
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
      </div>
    </Card>
  );
});
