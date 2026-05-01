import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Dynasty Business Adviser — Design Planet",
  description:
    "Кейс розробки корпоративного сайту для консалтингової компанії Dynasty Business Adviser в ОАЕ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
