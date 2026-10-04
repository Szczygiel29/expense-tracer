"use client";

import { ExpensesProvider } from "@/context/ExpensesContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/ToastContainer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ExpensesProvider>
        {children}
        <ToastContainer />
      </ExpensesProvider>
    </ToastProvider>
  );
}
