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

      // Add module rules to handle problematic packages
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/@supabase\/realtime-js/,
        use: {
          loader: "null-loader",
        },
      });

      // Ignore specific problematic files
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "@supabase/realtime-js": false,
        ws: false,
      };

      // Add plugins to define process.env and Buffer
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
          "process.env": JSON.stringify(process.env),
          global: "globalThis",
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^ws$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /@supabase\/realtime-js/,
        }),
      ];

      // Disable source map loader for problematic packages
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.loader && rule.loader.includes("source-map-loader")) {
          rule.exclude = [
            ...(rule.exclude || []),
            /node_modules\/@supabase\/realtime-js/,
            /node_modules\/ws/,
          ];
        }
      });

      return webpackConfig;
    },
  },
};
