import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://never-forgot.vercel.app/"),
  title: {
    default: "NeverForgot — I Can Never Forget Your Bill Dates & Warranties",
    template: "%s | NeverForgot",
  },
  description:
    "Smart AI bill & warranty expiration vault. Automatically track purchase invoices, AMC service contracts, gadget warranties, and insurance renewals before deadlines strike.",
  keywords: [
    "NeverForgot",
    "bill tracker",
    "warranty tracker",
    "invoice expiry tracker",
    "never forget bill dates",
    "policy renewal reminder",
    "amc contract manager",
    "gadget warranty keeper",
    "document expiry alerts",
    "free warranty claims tracker",
    "digital warranty vault",
    "ai invoice scanner",
  ],
  authors: [
    {
      name: "Krishna Patil",
      url: "https://www.linkedin.com/in/krishnapatil-dev",
    },
  ],
  creator: "Krishna Patil",
  publisher: "NeverForgot",
  applicationName: "NeverForgot",
  category: "productivity",
  classification: "Universal Bill & Warranty Expiry Vault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://never-forgot.vercel.app/",
    siteName: "NeverForgot",
    title: "NeverForgot — I Can Never Forget Your Bill Dates & Warranties",
    description:
      "Smart AI bill & warranty expiration vault. Never miss a deadline, renewal, or free warranty claim window again.",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "NeverForgot - Smart Bill & Warranty Expiry Sentinel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeverForgot — I Can Never Forget Your Bill Dates & Warranties",
    description:
      "Smart AI bill & warranty expiration vault. Track invoices, warranties, and insurance renewals effortlessly.",
    creator: "@krishnapatil",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NeverForgot",
  alternateName: "NeverForgot Bill & Warranty Expiry Vault",
  url: "https://never-forgot.vercel.app/",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "All",
  description:
    "Universal AI-powered bill, warranty, and insurance expiry vault. Never forget payment deadlines, renewal windows, or free warranty coverage again.",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Krishna Patil",
    url: "https://www.linkedin.com/in/krishnapatil-dev",
  },
  featureList: [
    "AI Invoice & Bill OCR Scanner",
    "Automated Expiry Calculation",
    "Proactive 30-Day and 7-Day Countdown Alerts",
    "Zero-telemetry Private Device Vault",
    "Multi-Category Management (Electronics, Vehicles, Health & Life Policies, AMC)",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${plusJakartaSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.className} min-h-full bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
