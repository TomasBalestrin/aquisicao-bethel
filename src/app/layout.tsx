import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "./fonts/poppins-latin-300-normal.woff2", weight: "300" },
    { path: "./fonts/poppins-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/poppins-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/poppins-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/poppins-latin-700-normal.woff2", weight: "700" },
    { path: "./fonts/poppins-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PerpetuoHQ",
  description: "Sistema de gestão de perpétuos para tráfego pago",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
