import type { Metadata } from "next";
import { Nunito, Space_Mono } from "next/font/google";
import "./globals.css";
import CommandBar from "@/components/CommandBar";
import FloatingDock from "@/components/FloatingDock";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusPulse — Analytics Dashboard",
  description: "Product Sales Insight Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${spaceMono.variable}`}>
      <body>
        <div className="shell">
          <CommandBar />
          <div className="main-area">
            <main className="main">
              {children}
            </main>
            <FloatingDock />
          </div>
        </div>
      </body>
    </html>
  );
}
