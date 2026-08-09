import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.hotmix.ma',
      },
      {
        protocol: 'https',
        hostname: 'hotmix-files.s3.eu-north-1.amazonaws.com',
      },
      {
        // Wildcard to catch any other S3 bucket region variants
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
    // Serve AVIF first (50% smaller), then WebP, then original
    formats: ['image/avif', 'image/webp'],
    // Tailored to product card sizes (sm: 160px, md: 320px, lg: 400px, xl: 500px)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 160, 256, 320, 400, 500],
    // Cache optimized images for 30 days (default is 60 seconds)
    minimumCacheTTL: 2592000,
  },
  // Allow importing JSON files for translations
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
