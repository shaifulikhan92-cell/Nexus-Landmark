import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Landmark | Thoughtful property, thoughtfully done",
  description: "Discover carefully selected homes and property opportunities with Nexus Landmark.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
