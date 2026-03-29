/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seeltransport.de",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/leistungen-mobeltransporte",
        destination: "/leistungen",
        permanent: true,
      },
      {
        source: "/impressum-berlin-seel-transport",
        destination: "/impressum",
        permanent: true,
      },
      {
        source: "/umzugsservice-berlin",
        destination: "/leistungen/umzug-berlin",
        permanent: true,
      },
      {
        source: "/leistungen/umzug",
        destination: "/leistungen/umzug-berlin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
