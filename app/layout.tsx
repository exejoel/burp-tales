import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burp Tales",
  description: "A personal food journal — recipes and restaurant visits",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="border-b px-8 py-4 flex gap-6">
          <Link href="/recipes" className="font-medium hover:underline">
            Recipes
          </Link>
          <Link href="/restaurants" className="font-medium hover:underline">
            Restaurants
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}