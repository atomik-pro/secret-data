import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
