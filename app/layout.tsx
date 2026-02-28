import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "( Hari Libur ) - 2026",
  description:
    "Indonesian holiday calendar to help you plan your vacations and time off.",
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
      <body className={` ${inter.variable} antialiased`}>
        <ThemeProvider />
        <div className="flex min-h-screen justify-center font-inter bg-background">
          <main className="flex min-h-screen w-full max-w-2xl flex-col pb-24 bg-background items-center">
            <Header />

            <Navigation />

            <section className="w-full flex justify-center">{children}</section>
            <footer className="w-full px-2 pt-10">
              <div className="w-full max-w-2xl text-[12px] py-4 space-y-2 text-neutral-400 dark:text-neutral-600">
                <div className="h-[1px] w-10 bg-neutral-200 mb-6" />
                <h2 className="mb-4">Acknowledgements</h2>
                {/* <p>
                  Special thanks to{" "}
                  <Link
                    href="https://www.bilacuti.my/"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Bilacuti
                  </Link>{" "}
                </p> */}
                <p>
                  This project was designed by{" "}
                  <Link
                    href="https://www.aldajulian.com"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Alda
                  </Link>{" "}
                  , with the help of... you guessed it.
                </p>
              </div>
            </footer>
          </main>
        </div>
        {/* <div className="blur"></div> */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
