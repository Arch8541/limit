import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Primary body font - Clean, modern sans-serif
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Mono font - For technical elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "LIMIT - Building Regulation Compliance Platform",
    template: "%s | LIMIT",
  },
  description:
    "Professional SaaS platform for GDCR 2017 compliance analysis in Gujarat/Ahmedabad. Get comprehensive regulatory reports in minutes.",
  keywords: [
    "GDCR 2017",
    "building compliance",
    "Gujarat regulations",
    "Ahmedabad",
    "FSI calculator",
    "building regulations",
    "AUDA",
    "AMC",
  ],
  authors: [{ name: "LIMIT" }],
  creator: "LIMIT",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://limit.app",
    siteName: "LIMIT",
    title: "LIMIT - Building Regulation Made Simple",
    description:
      "Professional SaaS platform for GDCR 2017 compliance analysis in Gujarat/Ahmedabad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LIMIT - Building Regulation Made Simple",
    description:
      "Professional SaaS platform for GDCR 2017 compliance analysis in Gujarat/Ahmedabad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to Google Fonts for Instrument Serif (display font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
