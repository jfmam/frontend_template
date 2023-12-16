/** @type {import('next').NextConfig} */
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false
});

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async redirects() {
    return [
      {
        source: '/challenge',
        destination: '/challenge/today-challenge',
        permanent: true,
      },
    ];
  }
};

module.exports = withBundleAnalyzer(nextConfig);
