"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Expense } from "@/types/expense";
import { monthlyTrend } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

interface MonthlyTrendChartProps {
  expenses: Expense[];
}

export default function MonthlyTrendChart({ expenses }: MonthlyTrendChartProps) {
  const data = useMemo(() => monthlyTrend(expenses, 6), [expenses]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
            width={50}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Spent"]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 13,
            }}
            cursor={{ fill: "#f0fdf4" }}
          />
          <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
