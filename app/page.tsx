import Link from "next/link";
import { NavbarLogo } from "@/components/navbar-logo";
import { ProductList } from "@/components/product-list";
import { ReservationHistory } from "@/components/reservation-history";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-teal-50 via-slate-50 to-white">
      <header className="sticky top-0 z-20 border-b border-teal-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <NavbarLogo className="shadow-none" />
          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-600">
              <li>
                <Link className="rounded-full px-3 py-2 text-accent hover:bg-teal-50" href="#dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href="#warehouses">
                  Warehouses
                </Link>
              </li>
              <li>
                <Link className="rounded-full px-3 py-2 hover:bg-slate-100" href="#reservations">
                  Reservations
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main
        id="dashboard"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-8 lg:px-8"
      >
        <section className="rounded-2xl border border-teal-100 bg-white/90 p-7 shadow-sm sm:p-9">
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Allo Health Operations
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Inventory Reservation Dashboard
            </h1>
            <p className="text-base leading-7 text-ink/70">
              Manage healthcare inventory in real time.
            </p>
          </div>
        </section>

        <section id="warehouses" className="flex flex-col gap-4">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Product Inventory Table
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Reserve available stock across fulfillment centers.
            </p>
          </div>
          <ProductList />
        </section>

        <section id="reservations" className="flex flex-col gap-4">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Recent Reservation Activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track holds, confirmations, releases, and expiry windows.
            </p>
          </div>
          <ReservationHistory />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
