const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
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
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, "static/index.html"),
        }),
        new ModuleFederationPlugin({
            name: "app",
            filename: "remoteEntry.js",
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        port: 3000,
        hot: true,
    },
};
