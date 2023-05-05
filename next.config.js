/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: 'export',
  distDir: 'docs',
  assetPrefix: '/gasshee',
  basePath: '/gasshee',
};

module.exports = nextConfig;
