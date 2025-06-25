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
    ];
  },
};

export default nextConfig;
