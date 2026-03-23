import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "USeP Poultry — Egg Counter",
  description:
    "Track and analyze egg production data across your poultry cages. View daily counts, size distributions, and production analytics.",
  keywords: ["egg counter", "poultry", "USeP", "egg production", "agriculture"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
