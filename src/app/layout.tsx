import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Landmark | Properties & Development",
  description: "Discover carefully selected homes and property opportunities with Nexus Landmark.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="overflow-x-hidden"><body>{children}</body></html>;
}

