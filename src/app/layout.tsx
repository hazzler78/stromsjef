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
        url: "https://stromsjef.no/logo-lightning.png",
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
      "https://stromsjef.no/logo-lightning.png"
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
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `
            (function(){
              try {
                var saved = localStorage.getItem('theme');
                if (saved === 'dark') { document.documentElement.classList.add('dark'); return; }
                if (saved === 'light') { document.documentElement.classList.remove('dark'); return; }

                var applyDark = function(isDark){
                  if (localStorage.getItem('theme')) return; // respect manual choice if set later
                  if (isDark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                };

                var scheduleNext = function(nextBoundaryMs, willBeDark){
                  try {
                    if (!Number.isFinite(nextBoundaryMs)) return;
                    var delay = Math.max(0, nextBoundaryMs - Date.now());
                    setTimeout(function(){ applyDark(willBeDark); }, delay);
                  } catch(_){}
                };

                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                // Fallback to system preference immediately to avoid flash
                applyDark(prefersDark);

                var computeFromSun = function(lat, lng){
                  var url = 'https://api.sunrise-sunset.org/json?formatted=0&lat='+lat+'&lng='+lng;
                  fetch(url).then(function(r){ return r.json(); }).then(function(data){
                    if (!data || !data.results) return;
                    var now = Date.now();
                    var sunrise = new Date(data.results.sunrise).getTime();
                    var sunset = new Date(data.results.sunset).getTime();

                    // If times are NaN, bail
                    if (!Number.isFinite(sunrise) || !Number.isFinite(sunset)) return;

                    var isNight = (now < sunrise) || (now >= sunset);
                    applyDark(isNight);

                    // Determine next boundary and target state after boundary
                    var nextBoundary = now < sunrise ? sunrise : (now < sunset ? sunset : (sunrise + 24*60*60*1000));
                    var willBeDark = nextBoundary === sunset ? true : false; // after sunrise -> light, after sunset -> dark
                    if (now >= sunset) { // next sunrise is tomorrow
                      willBeDark = false;
                    }
                    scheduleNext(nextBoundary, willBeDark);
                  }).catch(function(){});
                };

                var useGeo = function(){
                  if (!('geolocation' in navigator)) return false;
                  navigator.geolocation.getCurrentPosition(function(pos){
                    computeFromSun(pos.coords.latitude, pos.coords.longitude);
                  }, function(){
                    // Geolocation denied or failed; do nothing beyond prefers-color-scheme
                  }, { maximumAge: 6*60*60*1000, timeout: 3000 });
                  return true;
                };

                if (!useGeo()) {
                  // If geolocation is unavailable, prefers-color-scheme is our baseline
                }
              } catch (e) {}
            })();
          `
        }} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:image" content="https://stromsjef.no/logo-lightning.png" />
        <meta name="twitter:image" content="https://stromsjef.no/logo-lightning.png" />
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
