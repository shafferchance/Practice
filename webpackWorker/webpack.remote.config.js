const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
    mode: "production",
    entry: "./remoteFile/index.ts",
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
        port: 3001,
        hot: true,
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "remoteworker",
            filename: "remote-worker.js",
            exposes: {
                "./Remote": "./remoteFile/index.ts",
            },
        }),
    ],
};
