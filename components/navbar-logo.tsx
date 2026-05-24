import * as React from "react";
import { cn } from "@/lib/utils";

type NavbarLogoProps = {
  className?: string;
};

export function NavbarLogo({ className }: NavbarLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm",
        className
      )}
      aria-label="Allo Health Inventory Reservation System"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6] shadow-sm sm:h-12 sm:w-12">
        <span className="select-none text-[13px] font-semibold lowercase tracking-normal text-[#102033] sm:text-sm">
          allo
        </span>
      </div>

      <div className="min-w-0">
        <div className="truncate text-lg font-bold leading-tight tracking-normal text-[#102033] sm:text-xl">
          Allo Health
        </div>
        <div className="truncate text-xs font-medium leading-tight tracking-normal text-slate-500 sm:text-sm">
          Inventory Reservation System
        </div>
      </div>
    </div>
  );
}
