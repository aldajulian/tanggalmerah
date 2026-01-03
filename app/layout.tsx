import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";
import { Navigation } from "./components/Navigation";

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
          <main className="flex min-h-screen w-full max-w-[640px] flex-col pt-12 pb-24 bg-white dark:bg-background items-center">
            <header className="flex w-full flex-col items-start mb-8 text-center px-4">
              <span className="border font-semibold border-black/15 dark:border-white/15 text-sm px-3 py-1 rounded-full mb-4 dark:text-gray-300">
                🇮🇩 2026
              </span>
              <h1 className="text-2xl md:text-4xl font-semibold mb-6 dark:text-white text-left">
                Hari Libur{" "}
                <span className="inline-block -rotate-2 bg-red-500/10 rounded-full px-4 py-1 text-red-500">
                  Nasional
                </span>{" "}
                & <br className="hidden sm:block" />{" "}
                <span className="inline-block rotate-2 bg-sky-500/10 rounded-full px-4 py-1 text-sky-500">
                  Cuti Bersama
                </span>{" "}
                Indonesia
              </h1>
              <ul className="flex flex-wrap justify-center gap-4 text-sm text-black/60 dark:text-white/60 mb-8">
                <li className="flex items-center gap-2">
                  <span className="block size-2 rounded-full bg-red-500"></span>
                  Libur Nasional
                </li>
                <li className="flex items-center gap-2">
                  <span className="block size-2 rounded-full bg-sky-400"></span>
                  Cuti Bersama
                </li>
                <li className="flex items-center gap-2">
                  <span className="block size-2 rounded-full bg-neutral-200"></span>
                  Akhir Pekan
                </li>
              </ul>
            </header>

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
