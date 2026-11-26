import { memo } from "react";

const colorMap: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  prospect: "bg-blue-100 text-blue-800",
  churned: "bg-gray-100 text-gray-700",
  positive: "bg-green-100 text-green-800",
  neutral: "bg-gray-100 text-gray-700",
  negative: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  processing: "bg-amber-100 text-amber-800",
  call: "bg-indigo-100 text-indigo-800",
  email: "bg-purple-100 text-purple-800",
  meeting: "bg-teal-100 text-teal-800",
};

interface BadgeProps {
  value: string;
}

export const Badge = memo(function Badge({ value }: BadgeProps) {
  const classes = colorMap[value] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${classes}`}>
      {value}
    </span>
  );
});
