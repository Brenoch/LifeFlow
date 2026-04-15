import type { Metadata, Viewport } from "next";

import { LifeFlowProvider } from "@/context/lifeflow-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeFlow",
  description: "Rastreador inteligente de rotina e estudos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101113",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LifeFlowProvider>{children}</LifeFlowProvider>
      </body>
    </html>
  );
}
