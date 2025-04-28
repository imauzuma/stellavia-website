/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: false,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
