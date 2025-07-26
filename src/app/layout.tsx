import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  title: "Strømsjef - Finn billig strømavtale",
  description: "Finn billig strømavtale og bytt strømleverandør for å spare penger.",
  keywords: [
    "strøm", "strømavtale", "billig strøm", "bytte strøm", "strømleverandør", "strømpriser", "Norge", "fastpris", "spotpris", "finn billig strømavtale"
  ],
  openGraph: {
    title: "Strømsjef - Finn billig strømavtale",
    description: "Finn billig strømavtale og bytt strømleverandør for å spare penger.",
    url: "https://stromsjef.no/",
    type: "website",
    siteName: "Strømsjef",
    images: [
      {
        url: "https://stromsjef.no/logo-lightning.svg",
        width: 1200,
        height: 630,
        alt: "Strømsjef logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Strømsjef - Finn billig strømavtale",
    description: "Finn billig strømavtale og bytt strømleverandør for å spare penger.",
    images: [
      "https://stromsjef.no/logo-lightning.svg"
    ]
  },
  alternates: {
    canonical: "https://stromsjef.no/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:image" content="https://stromsjef.no/logo-lightning.svg" />
        <meta name="twitter:image" content="https://stromsjef.no/logo-lightning.svg" />
        <meta name="keywords" content="strøm, strømavtale, billig strøm, bytte strøm, strømleverandør, strømpriser, Norge, fastpris, spotpris, finn billig strømavtale" />
        <meta property="og:title" content="Strømsjef - Finn billig strømavtale" />
        <meta property="og:description" content="Finn billig strømavtale og bytt strømleverandør for å spare penger." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stromsjef.no/" />
        <meta property="og:site_name" content="Strømsjef" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Strømsjef - Finn billig strømavtale" />
        <meta name="twitter:description" content="Finn billig strømavtale og bytt strømleverandør for å spare penger." />
        <link rel="canonical" href="https://stromsjef.no/" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <div
            dangerouslySetInnerHTML={{
              __html: `
                <!-- Google Tag Manager (noscript) -->
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                <!-- End Google Tag Manager (noscript) -->
              `,
            }}
          />
        )}
        <Header />
        <main className="container mx-auto p-4">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
