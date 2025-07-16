import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creation OS - Personal Command System",
  description: "Build intentions, execute with focus, track every step.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}