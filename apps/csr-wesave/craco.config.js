const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CracoCSSModules = require('craco-css-modules');

module.exports = {
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
