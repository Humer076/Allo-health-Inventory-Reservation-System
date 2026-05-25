import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-[#1f2b3a] px-6 py-10 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-medium">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="h-px w-full bg-slate-700" />

        <p className="text-center text-sm text-slate-500">
          &copy; 2026 Allo Health. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
