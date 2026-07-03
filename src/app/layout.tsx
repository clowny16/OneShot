import type { Metadata } from "next";
import { DM_Sans, Libre_Franklin, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { SessionProvider } from "@/components/site/SessionProvider";

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OneShot | Wireless Earbuds Engineered for Everyday Sound",
  description:
    "OneShot crafts lightweight, durable wireless earbuds for music, calls, sport, and focus. Bluetooth 5.3, HD sound, all-day comfort. Free shipping across India.",
  keywords: [
    "OneShot",
    "wireless earbuds",
    "earbuds India",
    "Bluetooth 5.3",
    "true wireless",
    "ANC earbuds",
    "sports earbuds",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  authors: [{ name: "OneShot" }],
  openGraph: {
    title: "OneShot | Wireless Earbuds Engineered for Everyday Sound",
    description:
      "Lightweight, durable wireless earbuds for music, calls, sport, and focus.",
    siteName: "OneShot",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${dmSans.variable} ${libreFranklin.variable} ${ibmPlexSans.variable} antialiased bg-surface text-primary font-body`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
