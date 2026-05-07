import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Payment Gateway",
  description: "Mid-level Frontend Assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-slate-900">
        <main className="container mx-auto px-2 py-2 max-w-[90vw]">
          {children}
        </main>
      </body>
    </html>
  );
}