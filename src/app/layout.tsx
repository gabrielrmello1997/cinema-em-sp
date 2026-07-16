import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinema em São Paulo",
  description:
    "Programação semanal de cinemas de rua e salas especiais de São Paulo",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/assets/favicon.svg", type: "image/svg+xml" },
    ],
  },

  openGraph: {
    title: "Cinema em São Paulo",
    description:
      "Programação semanal de cinemas de rua e salas especiais de São Paulo",
    url: "https://cinemaemsaopaulo.com.br",
    siteName: "Cinema em São Paulo",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cinema em São Paulo",
      },
    ],
  },
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
