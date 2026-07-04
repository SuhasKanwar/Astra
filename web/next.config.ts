import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'three-globe', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }
    ]
  }
};

export default nextConfig;
