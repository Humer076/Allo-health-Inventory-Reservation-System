import * as React from "react";
import { cn } from "@/lib/utils";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive";
};

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        variant === "default" && "border-black/10 bg-white text-ink",
        variant === "destructive" && "border-red-200 bg-red-50 text-red-700",
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("mb-1 font-medium", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("leading-6", className)} {...props} />;
}
