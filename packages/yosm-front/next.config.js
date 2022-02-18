 /** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")(["shared"]);
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig;
module.exports = withPlugins([withTM], nextConfig);