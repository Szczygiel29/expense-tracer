"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "@/types/expense";
import { categoryBreakdown } from "@/lib/analytics";
import { CATEGORY_STYLES } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";

interface CategoryPieChartProps {
  expenses: Expense[];
}

export default function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const data = useMemo(() => categoryBreakdown(expenses), [expenses]);

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-400">
        No expenses yet to chart.
      </div>
    );
  }

  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_STYLES[entry.category].chart}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatCurrency(Number(value)), name]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((entry) => (
          <div key={entry.category} className="flex items-center gap-2 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${CATEGORY_STYLES[entry.category].dot}`}
            />
            <span className="text-slate-600">{entry.category}</span>
            <span className="ml-auto font-medium text-slate-900">
              {entry.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
