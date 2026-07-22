const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CracoCSSModules = require('craco-css-modules');
const Dotenv = require('dotenv-webpack');

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        },
      },
    },
    {
        plugin: CracoCSSModules
    },
    {
        plugin: new Dotenv()
    }
  ],
  style: {
    sass: {
      loaderOptions: {
        implementation: require('sass'),
        webpackImporter: false,
      },
    },
  },
};
