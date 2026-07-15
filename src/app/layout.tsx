import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinema em São Paulo",
  description: "Programação semanal de cinemas de rua e salas especiais de São Paulo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={sourceSans.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vxw7knc.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
