import type { Metadata } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Programação — Cinema em SP",
  description:
    "Acompanhe a programação de cineclubes e cinemas pela cidade de São Paulo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${sourceSans.variable} bg-background`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
