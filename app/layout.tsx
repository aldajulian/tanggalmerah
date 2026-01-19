import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";

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
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.svg",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#212121" },
  ],
  width: "device-width",
  initialScale: 1,
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
        <ThemeProvider />
        <div className="flex min-h-screen justify-center font-sans bg-background">
          <main className="flex min-h-screen w-full max-w-2xl flex-col pt-12 pb-24 bg-background items-center">
            <Header />

            <Navigation />

            <section className="w-full flex justify-center">{children}</section>
          </main>
        </div>
        {/* <div className="blur"></div> */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
