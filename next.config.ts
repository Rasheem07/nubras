import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'npflzgewiauusweatkoc.supabase.co'
      },
    ],
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
