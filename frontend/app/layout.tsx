import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrowEasy CSV Importer — AI-Powered CRM Import",
  description:
    "Upload any CSV file and let AI intelligently map your leads into GrowEasy CRM format. Supports Facebook Leads, Google Ads, Excel exports, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
