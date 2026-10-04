"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { CATEGORIES, type Category, type Expense, type ExpenseInput } from "@/types/expense";
import { todayISO } from "@/lib/utils";

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ExpenseInput) => void;
  initialExpense?: Expense | null;
}

interface FormState {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

interface FormErrors {
  date?: string;
  amount?: string;
  description?: string;
}

const EMPTY_FORM: FormState = {
  date: todayISO(),
  amount: "",
  category: "Food",
  description: "",
};

export default function ExpenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialExpense,
}: ExpenseFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEditing = Boolean(initialExpense);

  useEffect(() => {
    if (isOpen) {
      setForm(
        initialExpense
          ? {
              date: initialExpense.date,
              amount: String(initialExpense.amount),
              category: initialExpense.category,
              description: initialExpense.description,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [isOpen, initialExpense]);

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.date) {
      nextErrors.date = "Date is required.";
    } else if (form.date > todayISO()) {
      nextErrors.date = "Date cannot be in the future.";
    }

    const amountNum = Number(form.amount);
    if (!form.amount.trim()) {
      nextErrors.amount = "Amount is required.";
    } else if (Number.isNaN(amountNum) || amountNum <= 0) {
      nextErrors.amount = "Enter a valid amount greater than 0.";
    } else if (amountNum > 1_000_000) {
      nextErrors.amount = "Amount seems too large.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length > 120) {
      nextErrors.description = "Keep description under 120 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      date: form.date,
      amount: Math.round(Number(form.amount) * 100) / 100,
      category: form.category,
      description: form.description.trim(),
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Expense" : "Add Expense"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            max={todayISO()}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 py-2 pl-7 pr-3 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value as Category }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="e.g. Grocery shopping"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            {isEditing ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
