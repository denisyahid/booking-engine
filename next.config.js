/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed: Your app needs server-side features (auth, dynamic data)

  images: {
    unoptimized: true, // ⬅️ WAJIB untuk static export
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.103',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;