import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Subconscious.ai - AI-Powered SWOT Analysis Tool",
  description:
    "Generate intelligent SWOT analyses across customer segments with AI. Strategic insights for marketing OKRs, strengths, weaknesses, opportunities, and threats analysis.",
  keywords: [
    "SWOT analysis",
    "AI marketing",
    "customer segmentation",
    "strategic analysis",
    "marketing OKRs",
    "business intelligence",
    "competitive analysis",
    "market research",
    "AI insights",
    "strategic planning",
  ],
  authors: [{ name: "Subconscious.ai" }],
  creator: "Subconscious.ai",
  publisher: "Subconscious.ai",
  generator: "v0.app",
  applicationName: "Subconscious.ai SWOT Explorer",
  referrer: "origin-when-cross-origin",
  category: "Business Intelligence",
  classification: "Business Tool",

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://subconcious-ai.vercel.app",
    siteName: "Subconscious.ai",
    title: "Subconscious.ai - AI-Powered SWOT Analysis Tool",
    description:
      "Generate intelligent SWOT analyses across customer segments with AI. Strategic insights for marketing OKRs, strengths, weaknesses, opportunities, and threats analysis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Subconscious.ai SWOT Explorer - AI-Powered Strategic Analysis",
        type: "image/png",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@subconsciousai",
    creator: "@subconsciousai",
    title: "Subconscious.ai - AI-Powered SWOT Analysis Tool",
    description:
      "Generate intelligent SWOT analyses across customer segments with AI. Strategic insights for marketing OKRs, strengths, weaknesses, opportunities, and threats analysis.",
    images: ["/twitter-image.png"],
  },

  // Additional metadata
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

  // Verification and analytics
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  // App-specific metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Subconscious.ai",
  },

  // Manifest and icons
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },

  // Additional meta tags
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark light",
    "format-detection": "telephone=no",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Subconscious.ai SWOT Explorer",
              description: "AI-powered SWOT analysis tool for strategic business insights across customer segments",
              url: "https://subconcious-ai.vercel.app",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Subconscious.ai",
              },
              featureList: [
                "AI-powered SWOT analysis",
                "Customer segment analysis",
                "Marketing OKR generation",
                "Strategic insights",
                "Competitive analysis",
                "Export capabilities",
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
