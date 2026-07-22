import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
    env: {
      API_URL: "http://109.174.123.8:8080", //109.174.123.8
    },
    serverExternalPackages: ["pino", "pino-pretty"],
    output: 'standalone'
    
    };

export default nextConfig;
