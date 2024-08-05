import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const space = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "$WETH - The Future of Ethereum",
  description: "The future of ethereum is here. Claim your free $WETH now.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={space.className}>{children}</body>
    </html>
  );
}
