/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["shared"]);
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
    eslint: {
    dirs: ['pages'],
  },
}

module.exports = nextConfig;
module.exports = withPlugins([withTM], nextConfig);