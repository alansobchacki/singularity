import { NextConfig } from 'next';

const prodDomain = process.env.NEXT_PUBLIC_AVATAR_DOMAIN;

const nextConfig: NextConfig = {
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
