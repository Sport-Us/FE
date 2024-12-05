/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "ssl.pstatic.net", 
      "sportusbucket.s3.ap-northeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
