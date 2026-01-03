import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bila Libur",
  description:
    "Bila Libur adalah aplikasi untuk mengetahui libur nasional dan sekolah di Indonesia.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen justify-center font-sans dark:bg-background">
          <main className="flex min-h-screen w-full max-w-2xl flex-col pt-12 pb-24 bg-white dark:bg-background items-center">
            <Header />

            <Navigation />

            <section className="w-full flex justify-center">{children}</section>
          </main>
        </div>
        <div className="blur"></div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
