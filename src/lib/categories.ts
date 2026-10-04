import type { Category } from "@/types/expense";

export const CATEGORY_STYLES: Record<
  Category,
  { bg: string; text: string; dot: string; chart: string; icon: string }
> = {
  Food: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    chart: "#f97316",
    icon: "🍽️",
  },
  Transportation: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    chart: "#3b82f6",
    icon: "🚗",
  },
  Entertainment: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
    chart: "#a855f7",
    icon: "🎬",
  },
  Shopping: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    dot: "bg-pink-500",
    chart: "#ec4899",
    icon: "🛍️",
  },
  Bills: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    chart: "#ef4444",
    icon: "🧾",
  },
  Other: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-500",
    chart: "#64748b",
    icon: "📦",
  },
};
