const HtmlWebpackPlugin = require("html-webpack-plugin");
// Can also be destructured from require('webpack').container
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const mode = process.env.NODE_ENV || "production";

module.exports = {
    mode,
    entry: "./src/index",
    devtool: "source-map",
    output: {
        publicPath: "auto",
    },
    optimization: {
        minimize: mode === "production",
    },
    resolve: {
        extensions: [".jsx", ".js", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-react"],
                },
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "application_a",
            filename: "remoteEntry.js",
            exposes: {
                // prettier-ignore
                './SayHelloFromA': "./src/Message",
            },
            remotes: {
                application_b:
                    "application_b@http://localhost:3002/remoteEntry.js",
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
            template: "./public/index.html",
        }),
    ],
};
