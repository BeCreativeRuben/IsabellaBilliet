import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isabella Billiet",
  description: "Fine art by Isabella Billiet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
