"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/context/ExpensesContext";
import { useToast } from "@/context/ToastContext";
import FilterBar, { type Filters } from "@/components/FilterBar";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseFormModal from "@/components/ExpenseFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { exportExpensesToCSV } from "@/lib/utils";
import type { Expense, ExpenseInput } from "@/types/expense";

const EMPTY_FILTERS: Filters = {
  search: "",
  category: "All",
  startDate: "",
  endDate: "",
};

export default function ExpensesPage() {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { showToast } = useToast();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        if (filters.category !== "All" && e.category !== filters.category) return false;
        if (filters.startDate && e.date < filters.startDate) return false;
        if (filters.endDate && e.date > filters.endDate) return false;
        if (
          filters.search &&
          !e.description.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [expenses, filters]);

  function handleAddClick() {
    setEditingExpense(null);
    setIsFormOpen(true);
  }

  function handleEditClick(expense: Expense) {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }

  function handleSubmit(input: ExpenseInput) {
    if (editingExpense) {
      updateExpense(editingExpense.id, input);
      showToast("Expense updated successfully.");
    } else {
      addExpense(input);
      showToast("Expense added successfully.");
    }
    setIsFormOpen(false);
    setEditingExpense(null);
  }

  function handleConfirmDelete() {
    if (!deletingExpense) return;
    deleteExpense(deletingExpense.id);
    showToast("Expense deleted.", "info");
    setDeletingExpense(null);
  }

  function handleExport() {
    if (filteredExpenses.length === 0) {
      showToast("No expenses to export.", "error");
      return;
    }
    exportExpensesToCSV(filteredExpenses);
    showToast("CSV export started.");
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse, search, and manage all your expenses.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            Export CSV
          </button>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <span className="text-base leading-none">+</span>
            Add Expense
          </button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
        resultCount={filteredExpenses.length}
      />

      <ExpenseTable
        expenses={filteredExpenses}
        onEdit={handleEditClick}
        onDelete={setDeletingExpense}
      />

      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        initialExpense={editingExpense}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingExpense)}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deletingExpense?.description}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingExpense(null)}
      />
    </div>
  );
}
