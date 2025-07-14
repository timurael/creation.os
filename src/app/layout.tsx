import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creation OS - Personal Command System",
  description: "Build intentions, execute with focus, track every step.",
  keywords: ["productivity", "task management", "focus", "personal command system"],
  authors: [{ name: "Creation OS" }],
  creator: "Creation OS",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Creation OS",
    description: "Personal command system for builders and creators",
    siteName: "Creation OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creation OS",
    description: "Personal command system for builders and creators",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#32D74B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
