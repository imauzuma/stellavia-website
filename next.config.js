/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig;
