import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.hotmix.ma',
      },
    ],
  },
  // Allow importing JSON files for translations
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
