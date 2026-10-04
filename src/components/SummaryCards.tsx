"use client";

import { useMemo } from "react";
import type { Expense } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";
import { categoryBreakdown, currentMonthExpenses, sumAmount } from "@/lib/analytics";
import { CATEGORY_STYLES } from "@/lib/categories";

interface SummaryCardsProps {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const totalSpending = useMemo(() => sumAmount(expenses), [expenses]);

  const monthExpenses = useMemo(() => currentMonthExpenses(expenses), [expenses]);
  const monthlySpending = useMemo(() => sumAmount(monthExpenses), [monthExpenses]);

  const topCategory = useMemo(() => {
    const breakdown = categoryBreakdown(expenses);
    return breakdown[0] ?? null;
  }, [expenses]);

  const cards = [
    {
      label: "Total Spending",
      value: formatCurrency(totalSpending),
      hint: `${expenses.length} expense${expenses.length === 1 ? "" : "s"}`,
      accent: "text-slate-900",
    },
    {
      label: "This Month",
      value: formatCurrency(monthlySpending),
      hint: `${monthExpenses.length} expense${monthExpenses.length === 1 ? "" : "s"}`,
      accent: "text-emerald-700",
    },
    {
      label: "Top Category",
      value: topCategory ? topCategory.category : "—",
      hint: topCategory
        ? `${formatCurrency(topCategory.total)} (${topCategory.percentage.toFixed(0)}%)`
        : "No data yet",
      accent: topCategory ? CATEGORY_STYLES[topCategory.category].text : "text-slate-900",
    },
    {
      label: "Avg. per Expense",
      value: formatCurrency(expenses.length > 0 ? totalSpending / expenses.length : 0),
      hint: "Across all time",
      accent: "text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`mt-2 text-2xl font-semibold tracking-tight ${card.accent}`}>
            {card.value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
