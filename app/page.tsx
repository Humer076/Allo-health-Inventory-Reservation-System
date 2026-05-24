import { NavbarLogo } from "@/components/navbar-logo";
import { ProductList } from "@/components/product-list";
import { ReservationHistory } from "@/components/reservation-history";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <NavbarLogo className="shadow-none" />
          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-600">
              <li>
                <a className="rounded-md px-3 py-2 text-accent hover:bg-teal-50" href="#dashboard">
                  Dashboard
                </a>
              </li>
              <li>
                <a className="rounded-md px-3 py-2 hover:bg-slate-100" href="#warehouses">
                  Warehouses
                </a>
              </li>
              <li>
                <a className="rounded-md px-3 py-2 hover:bg-slate-100" href="#reservations">
                  Reservations
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="dashboard" className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Inventory Reservation Dashboard
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink/70">
            Manage healthcare inventory in real time.
          </p>
        </section>

        <section id="warehouses" className="flex flex-col gap-4">
          <div>
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
          <div>
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
    </div>
  );
}
