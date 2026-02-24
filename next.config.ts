import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
      API_URL: "http://192.168.43.23:8080",
    },
    serverExternalPackages: ["pino", "pino-pretty"],
  /* config options here */
};

export default nextConfig;
