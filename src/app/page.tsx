"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/context/ToastContext";
import SummaryCards from "@/components/SummaryCards";
import CategoryPieChart from "@/components/CategoryPieChart";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import ExpenseFormModal from "@/components/ExpenseFormModal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/categories";
import type { ExpenseInput } from "@/types/expense";

export default function DashboardPage() {
  const { expenses, isLoading, addExpense } = useExpenses();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  function handleAdd(input: ExpenseInput) {
    addExpense(input);
    setIsFormOpen(false);
    showToast("Expense added successfully.");
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your spending habits.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <span className="text-base leading-none">+</span>
          Add Expense
        </button>
      </div>

      <SummaryCards expenses={expenses} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Spending by Category
          </h2>
          <CategoryPieChart expenses={expenses} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Monthly Trend (last 6 months)
          </h2>
          <MonthlyTrendChart expenses={expenses} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Expenses</h2>
          <Link href="/expenses" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
            View all →
          </Link>
        </div>
        {recentExpenses.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No expenses yet. Add your first one to get started.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentExpenses.map((expense) => {
              const style = CATEGORY_STYLES[expense.category];
              return (
                <li key={expense.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${style.bg} text-base`}
                    >
                      {style.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {expense.description}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}
