"use client";

import type { Expense } from "@/types/expense";
import { CATEGORY_STYLES } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <p className="text-sm font-medium text-slate-500">No expenses found.</p>
        <p className="mt-1 text-xs text-slate-400">
          Try adjusting your filters or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop table */}
      <table className="hidden w-full text-left sm:table">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Description</th>
            <th className="px-5 py-3 text-right">Amount</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => {
            const style = CATEGORY_STYLES[expense.category];
            return (
              <tr key={expense.id} className="transition-colors hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-600">
                  {formatDate(expense.date)}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    <span>{style.icon}</span>
                    {expense.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{expense.description}</td>
                <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {expenses.map((expense) => {
          const style = CATEGORY_STYLES[expense.category];
          return (
            <div key={expense.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    <span>{style.icon}</span>
                    {expense.category}
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {expense.description}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatDate(expense.date)}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="flex-1 rounded-md border border-slate-200 py-1.5 text-xs font-medium text-slate-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(expense)}
                  className="flex-1 rounded-md border border-red-200 py-1.5 text-xs font-medium text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
