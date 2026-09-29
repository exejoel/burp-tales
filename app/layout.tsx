import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { SignOutButton } from "@/components/AuthButtons";
import { isOwner } from "@/lib/owner";
import "./globals.css";

// Display face for the wordmark and dish names; body face for everything else.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burp Tales",
  description: "A personal food journal: recipes and restaurant visits",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Only reads the encrypted session cookie, so it's cheap. Signing out
  // calls router.refresh(), which re-renders this layout without the button.
  const signedIn = await isOwner();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-rule">
          <nav className="mx-auto flex w-full max-w-3xl items-baseline justify-between px-6 py-5">
            <Link
              href="/"
              className="font-display text-2xl font-semibold italic tracking-tight"
            >
              Burp Tales
            </Link>
            <div className="flex items-baseline gap-6">
              <NavLinks />
              {signedIn && (
                <SignOutButton className="text-sm text-muted transition-colors hover:text-ink disabled:opacity-50" />
              )}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}