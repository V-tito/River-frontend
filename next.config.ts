import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
    env: {
      API_URL: "http://localhost:8080",
    },
    serverExternalPackages: ["pino", "pino-pretty"],
    output: 'standalone',
    //outputFileTracingRoot: path.join(__dirname, '../../'),
    
    }

export default nextConfig;
