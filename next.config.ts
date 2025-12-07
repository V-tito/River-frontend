import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
      API_URL: "http://localhost:8080",
    },
    serverExternalPackages: ["pino", "pino-pretty"],
  /* config options here */
};

export default nextConfig;
