import { memo } from "react";

const colorMap: Record<string, string> = {
  positive: "bg-success-container text-on-success-container",
  neutral: "bg-warning-container text-on-warning-container",
  negative: "bg-danger-container text-on-danger-container",
  success: "bg-success-container text-on-success-container",
  failed: "bg-danger-container text-on-danger-container",
  processing: "bg-warning-container text-on-warning-container",
  call: "bg-info-container text-on-info-container",
  email: "bg-primary-container text-on-primary-container",
  meeting: "bg-surface-container text-on-surface-variant",
};

interface BadgeProps {
  value: string;
}

export const Badge = memo(function Badge({ value }: BadgeProps) {
  const classes = colorMap[value] ?? "bg-surface-container text-on-surface-variant";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 font-label text-label-md capitalize ${classes}`}>
      {value}
    </span>
  );
});
