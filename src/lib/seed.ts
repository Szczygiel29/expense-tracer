import type { Expense } from "@/types/expense";
import { generateId, todayISO } from "@/lib/utils";

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function createSeedExpenses(): Expense[] {
  const now = new Date().toISOString();
  const seeds: Omit<Expense, "id" | "createdAt">[] = [
    { date: todayISO(), amount: 24.5, category: "Food", description: "Grocery run" },
    { date: daysAgoISO(1), amount: 12.0, category: "Transportation", description: "Ride share" },
    { date: daysAgoISO(2), amount: 45.99, category: "Entertainment", description: "Movie night" },
    { date: daysAgoISO(4), amount: 89.0, category: "Shopping", description: "New shoes" },
    { date: daysAgoISO(6), amount: 120.0, category: "Bills", description: "Internet bill" },
    { date: daysAgoISO(9), amount: 15.75, category: "Food", description: "Coffee & lunch" },
    { date: daysAgoISO(15), amount: 60.0, category: "Transportation", description: "Gas fill-up" },
    { date: daysAgoISO(20), amount: 35.2, category: "Other", description: "Pharmacy" },
    { date: daysAgoISO(35), amount: 150.0, category: "Bills", description: "Electricity bill" },
    { date: daysAgoISO(40), amount: 22.4, category: "Food", description: "Takeout dinner" },
  ];

  return seeds.map((s) => ({ ...s, id: generateId(), createdAt: now }));
}
