import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "destructive" | "secondary";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm",
        variant === "default" && "border-transparent bg-accent text-white",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        variant === "warning" && "border-sky-200 bg-sky-50 text-sky-700",
        variant === "destructive" && "border-red-200 bg-red-50 text-red-700",
        variant === "secondary" && "border-slate-200 bg-slate-100 text-slate-600",
        className
      )}
      {...props}
    />
  );
}
