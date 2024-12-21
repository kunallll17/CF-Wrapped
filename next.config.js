/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'userpic.codeforces.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'userpic.codeforces.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.codeforces.com',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;
