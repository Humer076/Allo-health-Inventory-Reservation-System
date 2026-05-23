import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-accent text-white hover:bg-accent/90",
        variant === "outline" && "border border-black/15 bg-white hover:bg-black/[0.03]",
        variant === "ghost" && "hover:bg-black/[0.03]",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 px-3",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
