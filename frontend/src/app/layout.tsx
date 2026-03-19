import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import AuthNav from "../components/auth-nav";
import RoleNav from "../components/role-nav";

export const metadata: Metadata = {
  title: "Smart Logistics Platform",
  description: "Real-time shipment tracking and courier management"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-black/10 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-[0.08em]">
              Smart Logistics
            </Link>

            <nav className="flex flex-wrap items-center gap-4 text-sm">
              <RoleNav />
              <AuthNav />
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
