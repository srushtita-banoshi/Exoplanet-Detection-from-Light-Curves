/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://127.0.0.1:8000/api/:path*' },
    ];
  },
  webpack: (config, { dev }) => {
    // Avoid "Array buffer allocation failed" during webpack cache pack (Gunzip)
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
