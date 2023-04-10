const TsconfigPathsPlugin  = require('tsconfig-paths-webpack-plugin');
const path = require('path');

module.exports = {
  "stories": [
    "../components/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss"
  ],
  "framework": {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: path.resolve(__dirname, '../next.config.js'),
    },},
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  "webpackFinal": async (config) => {
     config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];

    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          util: require.resolve('util/'),
          ...config.resolve.fallback
        }
      }
    }
  },
  // "babel": async (options) => {
  //   options.presets.push(['next/babel'])
  //   return options
  // },
}