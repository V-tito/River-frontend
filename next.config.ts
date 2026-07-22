import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
    env: {
      API_URL: "http://localhost:8080", //109.174.123.8
    },
    serverExternalPackages: ["pino", "pino-pretty"],
    output: 'standalone',
    typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
    };

export default nextConfig;
