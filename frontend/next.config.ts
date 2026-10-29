import { NextConfig } from 'next';

const prodDomain = process.env.NEXT_PUBLIC_AVATAR_DOMAIN;
const apiUrl = process.env.API_URL || 'http://localhost:3800';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      ...(prodDomain
        ? [
            {
              protocol: 'https' as const,
              hostname: prodDomain,
              pathname: '/avatars/**',
            },
          ]
        : []),
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '3000',
        pathname: '/avatars/**',
      },
    ],
  },
};

export default nextConfig;
