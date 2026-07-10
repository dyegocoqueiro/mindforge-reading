import type { Metadata } from "next";
import { PwaRegister } from "../src/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MindForge Reading", template: "%s | MindForge Reading" },
  description: "Treino de leitura com compreensão, retenção e ritmo em equilíbrio.",
  manifest: "/manifest.webmanifest",
  applicationName: "MindForge Reading",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "MindForge" },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}<PwaRegister /></body>
    </html>
  );
}
