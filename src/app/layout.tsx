import type { Metadata } from "next";
import { Nunito, Space_Mono } from "next/font/google";
import "./globals.css";
import CommandBar from "@/components/CommandBar";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

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
  description: "A claymorphic dashboard providing real-time product sales insights, revenue trends, and market analysis.",
  keywords: ["analytics", "dashboard", "sales", "revenue", "nexus pulse", "claymorphism", "e-commerce"],
  metadataBase: new URL("https://product-sales-insight-black.vercel.app"),
  openGraph: {
    title: "NexusPulse — Analytics Dashboard",
    description: "A claymorphic dashboard providing real-time product sales insights, revenue trends, and market analysis.",
    url: "https://product-sales-insight-black.vercel.app",
    siteName: "NexusPulse",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NexusPulse Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusPulse — Analytics Dashboard",
    description: "A claymorphic dashboard providing real-time product sales insights, revenue trends, and market analysis.",
    images: ["/opengraph-image.png"],
  },
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
          <Suspense fallback={<div className="command-bar" />}>
            <CommandBar />
          </Suspense>
          <div className="main-area">
            <Sidebar />
            <main className="main">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
