import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/spotpriskontroll',
        destination: '/fastpriskalkulator',
        permanent: true, // 301 redirect for SEO
      },
      {
        source: '/om-stromsjef',
        destination: '/om-oss',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/ofte-stilte-sporsmal',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/personvern',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/brukervilkar',
        permanent: true,
      },
      {
        source: '/business',
        destination: '/bedrift',
        permanent: true,
      },
      {
        source: '/spotpriskalkulator',
        destination: '/fastpriskalkulator',
        permanent: true,
      },
      {
        source: '/kontakt',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
