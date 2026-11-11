import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutSwitcher from "./layoutSwitcher";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LAB-Ux | Laboratorio de Usabilidad - UNCA",
  description:
    "Laboratorio de Usabilidad de la Universidad Nacional de Catamarca",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutSwitcher>{children}</LayoutSwitcher>
      </body>
    </html>
  );
}
