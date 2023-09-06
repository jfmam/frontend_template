/** @type {import('next').NextConfig} */
const path = require('path');

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
  },
  webpack: (config, { isServer }) => {
    // 서버 빌드 시에만 해당 확장자를 제외

    config.module.rules.push({
      test: /\.stories\.(js|jsx|ts|tsx)$/, // 원하는 확장자 추가
      use: 'ignore-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
