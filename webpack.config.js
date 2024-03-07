const path = require("path");

const config = [
  {
    entry: "./src/App.tsx",
    output: {
      path: path.resolve(__dirname, "assets"),
      filename: "app.js",
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    mode: "development",
  },
  {
    entry: "./src/checks/CheckFactory.tsx",
    output: {
      path: path.resolve(__dirname, "assets"),
      filename: "checkFactory.js",
      library: {
        type: "commonjs-module",
      },
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    mode: "development",
  },
];

module.exports = config;
