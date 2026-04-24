import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssetTrack Pro - Premium",
  description: "Enterprise SaaS Company Asset Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col cinematic-bg text-gray-100 overflow-x-hidden font-sans`}>
        {children}
      </body>
    </html>
  );
}
