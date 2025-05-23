import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack, CssExtractRspackPlugin } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/main.jsx",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isDev ? { loader: "style-loader" } : { loader: CssExtractRspackPlugin.loader },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: "postcss.config.js",
              },
            },
          },
        ],
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new rspack.EnvironmentPlugin({
      // Map you .env variables here ..
      WEBSOCKET_URL: process.env.WEBSOCKET_URL || "http://localhost:8080/hl_price",
      BACKEND_API_URL: process.env.BACKEND_API_URL || "http://localhost:3000",
      ALLOWED_ENCRYPTION_DECRYPTION: process.env.ALLOWED_ENCRYPTION_DECRYPTION,
      HL_MAXIMUM_BET_LIMIT: process.env.HL_MAXIMUM_BET_LIMIT,
      HL_MINIMUM_BET_LIMIT: process.env.HL_MINIMUM_BET_LIMIT,
      NODE_ENV: process.env.NODE_ENV || "development", // Include NODE_ENV for libraries
      RT_KEY: process.env.NODE_ENV || "4kxrs1P3gbc99274NzR6BYBXAhlXsXYb"
    }),
    isDev ? new RefreshPlugin() : null,
    !isDev &&
      new CssExtractRspackPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    process.env.ANALYZE &&
      new rspack.BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: "bundle-report.html",
        openAnalyzer: true,
      }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 200000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 0,
          enforce: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10,
          enforce: true,
          maxSize: 200000,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          maxSize: 200000,
        },
      },
    },
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  performance: {
    hints: false,
  },
  devServer: {
    hot: true,
  },
  watch: true,
});