import type { NextConfig } from 'next';

const nextConfig: NextConfig & { experimental: { appDir: boolean } } = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['ssl.pstatic.net'],
  },
};

export default nextConfig;
