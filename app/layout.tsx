import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Allo Inventory Reservations",
  description: "Inventory reservation flow for multi-warehouse checkout."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
