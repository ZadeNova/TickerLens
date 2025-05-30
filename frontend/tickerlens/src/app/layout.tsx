import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { IBM_Plex_Sans } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { NavBar } from "@/components/ui/Navbar";

const space = Space_Grotesk(
  {
    subsets: ['latin'],
    variable:"--font-space"
  }
)

const inter = Inter({
  subsets:['latin'],
  variable:"--font-inter",
});

const plex = IBM_Plex_Sans({
  subsets:['latin'],
  weight: ['300','400','600'],
  variable: '--font-plex',

});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    default: "TickerLens",
    template: "%s | TickerLens",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body className={`${inter.variable} ${plex.variable} ${space.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        <NavBar/>
        <main>
          {children}
        </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
