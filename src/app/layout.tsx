import "./globals.css";
import type { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}
