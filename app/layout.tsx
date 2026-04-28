import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import QuickExitButton from "@/components/QuickExitButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unbridaled — Financial Scenario Planning",
  description:
    "Understand your financial picture. Model what your finances could look like in different scenarios.",
  robots: "noindex, nofollow", // Privacy-first: no indexing of app pages
};

const DISCLAIMER =
  "UNBRIDALED provides educational financial scenarios. This is not financial, legal, or tax advice. Consult a licensed financial advisor and family law attorney for guidance on your specific situation.";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <QuickExitButton />
        {children}
        <footer className="mt-auto border-t border-stone-200 bg-white px-6 py-5">
          <p className="text-xs text-stone-500 max-w-3xl mx-auto text-center">{DISCLAIMER}</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/legal/terms" className="text-xs text-stone-400 hover:text-stone-600">Terms</Link>
            <Link href="/legal/privacy" className="text-xs text-stone-400 hover:text-stone-600">Privacy</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
