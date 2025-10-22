import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Splitysplit",
  description: "Fast cost splitting for trips & dinners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gradient-to-br from-slate-100 via-white to-emerald-100 text-slate-900 antialiased">
        <div className="flex min-h-dvh flex-col">
          <header className="border-b border-emerald-200/50 bg-white/70 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
              <Link
                href="/"
                className="text-lg font-semibold text-emerald-600 transition hover:text-emerald-500"
              >
                Splitysplit
              </Link>
              <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Link
                  href="/"
                  className="rounded-lg px-3 py-1 transition hover:bg-emerald-100 hover:text-emerald-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-emerald-500 px-3 py-1 text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
                >
                  Log in
                </Link>
              </nav>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
