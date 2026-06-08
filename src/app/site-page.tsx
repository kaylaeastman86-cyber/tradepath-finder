import type { ReactNode } from "react";
import Link from "next/link";

export function SitePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-4xl content-start gap-6 p-6 text-[#17212b]">
      <nav className="flex flex-wrap gap-4 text-sm text-[#205b91]" aria-label="Site navigation">
        <Link className="font-semibold" href="/">TradePath Finder</Link>
        <Link className="font-semibold" href="/about">About</Link>
        <Link className="font-semibold" href="/methodology">Methodology</Link>
        <Link className="font-semibold" href="/privacy">Privacy</Link>
        <Link className="font-semibold" href="/terms">Terms</Link>
        <Link className="font-semibold" href="/contact">Contact</Link>
      </nav>
      <article className="grid gap-4 border border-[#d8e0e7] bg-white p-6 leading-7 shadow-[0_18px_45px_rgba(21,33,45,0.08)]">
        <h1 className="text-3xl font-bold tracking-normal">{title}</h1>
        <div className="grid gap-4 text-[#314354]">{children}</div>
      </article>
    </main>
  );
}
