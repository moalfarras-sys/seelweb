/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
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
        source: "/preise",
        destination: "/buchen",
        statusCode: 301,
      },
      {
        source: "/preise-mobeltransporte",
        destination: "/buchen",
        statusCode: 301,
      },
      {
        source: "/leistungen/reinigung-buero",
        destination: "/leistungen/bueroreinigung",
        statusCode: 301,
      },
      {
        source: "/leistungen-mobeltransporte",
        destination: "/leistungen/transport",
        statusCode: 301,
      },
      {
        source: "/impressum-berlin-seel-transport",
        destination: "/impressum",
        statusCode: 301,
      },
      {
        source: "/umzugsservice-berlin",
        destination: "/leistungen/umzug-berlin",
        statusCode: 301,
      },
      {
        source: "/leistungen/umzug",
        destination: "/leistungen/umzug-berlin",
        statusCode: 301,
      },
      {
        source: "/2024/:path*",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/2025/:path*",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
