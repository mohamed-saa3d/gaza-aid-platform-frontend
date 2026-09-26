/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.6', '192.168.1.6:3000', 'localhost:3000'],
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://gaza-aid-platform-backend-five.vercel.app/api/v1/:path*',
      },
    ];
  },
}

export default nextConfig
