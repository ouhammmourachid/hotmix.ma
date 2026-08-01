import type { NextConfig } from "next";
import path from "path";

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
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
