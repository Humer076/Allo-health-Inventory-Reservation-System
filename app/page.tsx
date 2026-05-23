import { ProductList } from "@/components/product-list";
import { ReservationHistory } from "@/components/reservation-history";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-8">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <p className="text-lg font-semibold uppercase tracking-wide text-accent">STOCKFLOW</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Inventory reservations</h1>
        <p className="max-w-2xl text-sm leading-6 text-ink/70">
          Reserve units during checkout, confirm successful payments, and release failed or expired
          holds back into available stock.
        </p>
      </header>
      <ProductList />
      <ReservationHistory />
    </main>
  );
}
