export const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  date: string; // ISO yyyy-mm-dd
  amount: number;
  category: Category;
  description: string;
  createdAt: string; // ISO timestamp
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;
