/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seeltransport.de",
      },
    ],
  },
};

export default nextConfig;
