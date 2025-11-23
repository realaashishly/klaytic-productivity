import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    // Recommended way to configure external domains in modern Next.js
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        // Optional: specify allowed port if needed, usually omitted for standard HTTPS (443)
        // port: '', 
        // Optional: specify allowed pathname if the host serves images under a specific path
        // pathname: '/account123/**', 
      },
      // You may need to add other image hostnames here (e.g., S3, Cloudinary, etc.)
      {
        protocol: 'https',
        hostname: 'placehold.co', // If you use placeholder images
      },
    ],
    // Legacy 'domains' property is still supported but 'remotePatterns' is preferred
    // domains: ['avatar.vercel.sh'], 
  },
};

export default nextConfig;
