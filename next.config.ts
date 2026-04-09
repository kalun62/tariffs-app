import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/tarrifs-app',
  trailingSlash: true,  
  images: {
    unoptimized: true,  
  },
};

export default nextConfig;
