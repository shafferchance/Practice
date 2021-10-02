const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { getRemoteEntryUrl } = require("../common");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
    mode: "development",
    entry: "./src/index",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3002,
    },
    output: {
        publicPath: "auto",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-react"],
                },
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "app2",
            library: { type: "var", name: "app2" },
            filename: "remoteEntry.js",
            exposes: {
                "./Button": "./src/Button",
            },
            shared: {
                react: {
                    singleton: true,
                },
                "react-dom": {
                    singleton: true,
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: "./static/index.html",
        }),
    ],
};
