import Link from "next/link";
import type { ReactNode } from "react";
import { NavbarLogo } from "@/components/navbar-logo";
import { SiteFooter } from "@/components/site-footer";

type InfoPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
};

export function InfoPage({ title, eyebrow, description, children }: InfoPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Go to dashboard">
            <NavbarLogo className="shadow-none" />
          </Link>
          <nav aria-label="Page navigation">
            <ul className="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-600">
              <li>
                <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="rounded-md px-3 py-2 hover:bg-slate-100" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
        <section className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">{description}</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
