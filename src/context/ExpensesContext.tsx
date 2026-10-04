"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Expense, ExpenseInput } from "@/types/expense";
import { generateId } from "@/lib/utils";
import { createSeedExpenses } from "@/lib/seed";

const STORAGE_KEY = "expense-tracker:expenses";
const SEEDED_KEY = "expense-tracker:seeded";

interface ExpensesContextValue {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (input: ExpenseInput) => Expense;
  updateExpense: (id: string, input: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
  clearAll: () => void;
}

const ExpensesContext = createContext<ExpensesContextValue | undefined>(
  undefined
);

function loadFromStorage(): Expense[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Expense[];
    }
  } catch {
    // ignore parse errors, fall through to seed
  }

  const alreadySeeded = window.localStorage.getItem(SEEDED_KEY);
  if (!alreadySeeded) {
    const seeded = createSeedExpenses();
    window.localStorage.setItem(SEEDED_KEY, "1");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  return [];
}

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setExpenses(loadFromStorage());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, isLoading]);

  const addExpense = useCallback((input: ExpenseInput) => {
    const newExpense: Expense = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, input: ExpenseInput) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...input } : e))
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setExpenses([]);
  }, []);

  const value = useMemo(
    () => ({
      expenses,
      isLoading,
      addExpense,
      updateExpense,
      deleteExpense,
      clearAll,
    }),
    [expenses, isLoading, addExpense, updateExpense, deleteExpense, clearAll]
  );

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses(): ExpensesContextValue {
  const ctx = useContext(ExpensesContext);
  if (!ctx) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return ctx;
}
