"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "default";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastInput = Omit<Toast, "id">;

const ToastContext = React.createContext<{ toast: (input: ToastInput) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((input: ToastInput) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { ...input, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border bg-white px-4 py-3 text-sm shadow-lg",
              item.variant === "success" && "border-emerald-200",
              item.variant === "error" && "border-red-200",
              item.variant === "warning" && "border-amber-200",
              item.variant === "default" && "border-black/10"
            )}
          >
            <p
              className={cn(
                "font-semibold",
                item.variant === "success" && "text-emerald-700",
                item.variant === "error" && "text-red-700",
                item.variant === "warning" && "text-amber-700",
                item.variant === "default" && "text-ink"
              )}
            >
              {item.title}
            </p>
            {item.description ? <p className="mt-1 leading-5 text-ink/70">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
