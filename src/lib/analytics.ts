import type { Category, Expense } from "@/types/expense";
import { monthKey, monthLabel, todayISO } from "@/lib/utils";

export function sumAmount(expenses: Expense[]): number {
  return expenses.reduce((total, e) => total + e.amount, 0);
}

export function currentMonthExpenses(expenses: Expense[]): Expense[] {
  const currentKey = monthKey(todayISO());
  return expenses.filter((e) => monthKey(e.date) === currentKey);
}

export interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number;
}

export function categoryBreakdown(expenses: Expense[]): CategoryTotal[] {
  const total = sumAmount(expenses);
  const totals = new Map<Category, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  return Array.from(totals.entries())
    .map(([category, catTotal]) => ({
      category,
      total: catTotal,
      percentage: total > 0 ? (catTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export interface MonthlyTotal {
  key: string;
  label: string;
  total: number;
}

export function monthlyTrend(expenses: Expense[], months = 6): MonthlyTotal[] {
  const totals = new Map<string, number>();
  for (const e of expenses) {
    const key = monthKey(e.date);
    totals.set(key, (totals.get(key) ?? 0) + e.amount);
  }

  const result: MonthlyTotal[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ key, label: monthLabel(key), total: totals.get(key) ?? 0 });
  }
  return result;
}
