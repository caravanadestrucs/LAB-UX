
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

import * as React from "react";



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
  description: "Laboratorio de Usabilidad de la Universidad Nacional de Catamarca",
};

export default function LayoutNormal({
  children,
}: Readonly<{
  children: React.ReactNode;

}>

) {

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
