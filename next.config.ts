import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
      API_URL: "http://localhost:8080",
      defaultScheme: "4"
    },
  /* config options here */
};

export default nextConfig;
