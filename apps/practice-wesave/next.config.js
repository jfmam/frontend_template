/** @type {import('next').NextConfig} */
const path = require('path')

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
}

module.exports = nextConfig
