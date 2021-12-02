const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;

module.exports = {
  mode: "development",
  entry: "./remoteFile2/src/index.ts",
  // output: {
  //   filename: "remote-worker.system.js",
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    port: 3002,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteworker2",
      filename: "remote-worker-2.js",
      exposes: {
        "./Remote2": "./remoteFile2/src/index.ts",
      },
      shared: ["chalk"],
    }),
  ],
};
