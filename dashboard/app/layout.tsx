import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Retail — AI Demand Forecasting & Inventory Planner",
  description:
    "AI-powered demand forecasting that transforms retail sales patterns into future demand predictions and inventory planning decisions. Built with XGBoost, featuring 33 product families and 16-day recursive forecasting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0A0A0F] text-[#F5F0E8] antialiased">
        {children}
      </body>
    </html>
  );
}
