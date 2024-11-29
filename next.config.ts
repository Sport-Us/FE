import type { NextConfig } from "next";

const nextConfig: NextConfig & { experimental: { appDir: boolean } } = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "ssl.pstatic.net", 
      "sportusbucket.s3.ap-northeast-2.amazonaws.com", 
    ],
  },
};

export default nextConfig;
