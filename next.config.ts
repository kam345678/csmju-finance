import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // หรือขนาดที่ต้องการ
    },
  },
};

export default nextConfig;
