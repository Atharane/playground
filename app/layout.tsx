import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/providers/theme";

import { ViewportIndicator } from "@/components/viewport-indicator";
import { SnowfallComponent } from "@/components/snowfall";
import { Toaster } from "@/components/ui/sonner";

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
  title: "code playground",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<span>loading...</span>}>
            <TooltipProvider>{children}</TooltipProvider>
          </Suspense>
          <Toaster />
          <ThemeToggle />
          <ViewportIndicator />
          <SnowfallComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}
