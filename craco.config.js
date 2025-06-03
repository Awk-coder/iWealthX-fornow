const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        vm: false,
        fs: false,
        path: false,
        os: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        timers: false,
        assert: false,
        events: false,
        constants: false,
        ws: false,
      };

      // Simple plugins for global handling
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
          global: "globalThis",
        }),
        new webpack.ProvidePlugin({
          global: "globalThis",
        }),
      ];

      return webpackConfig;
    },
  },
};
