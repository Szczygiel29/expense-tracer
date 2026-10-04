"use client";

import { useToast } from "@/context/ToastContext";
import clsx from "clsx";

const KIND_STYLES: Record<string, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-slate-800 text-white",
};

const KIND_ICON: Record<string, string> = {
  success: "✓",
  error: "⚠",
  info: "ℹ",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={clsx(
            "flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ring-1 ring-black/5 animate-in min-w-[220px] max-w-sm",
            KIND_STYLES[toast.kind]
          )}
        >
          <span className="text-base leading-none">{KIND_ICON[toast.kind]}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
