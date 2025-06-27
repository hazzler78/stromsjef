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
    ];
  },
};

export default nextConfig;
