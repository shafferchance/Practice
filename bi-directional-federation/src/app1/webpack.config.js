const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
    entry: "./src/index",
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3001,
    },
    resolve: {
        extensions: [".js", "jsx"],
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
            name: "app1",
            filename: "remoteEntry.js",
            remotes: {
                app2: "app2@http://localhost:3002/remoteEntry.js",
            },
            exposes: {
                "./Button": "./src/Button",
            },
            shared: [
                {
                    ...deps,
                    react: {
                        singleton: true,
                        requiredVersion: deps.react,
                    },
                    "react-dom": {
                        singleton: true,
                        requiredVersion: deps["react-dom"],
                    },
                },
            ],
        }),
        // new ModuleFederationPlugin({
        //     name: "header",
        //     filename: "header.js",
        //     exposes: {
        //         "./start": "./src/header.appjsx",
        //     },
        //     shared: [
        //         {
        //             ...deps,
        //             react: {
        //                 singleton: true,
        //                 requiredVersion: deps.react,
        //             },
        //             "react-dom": {
        //                 singleton: true,
        //                 requiredVersion: deps["react-dom"],
        //             },
        //         },
        //     ],
        // }),
        // new ModuleFederationPlugin({
        //     name: "footer",
        //     filename: "footer.js",
        //     exposes: {
        //         "./start": "./src/components/app.jsx",
        //     },
        //     shared: [
        //         {
        //             ...deps,
        //             react: {
        //                 singleton: true,
        //                 requiredVersion: deps.react,
        //             },
        //             "react-dom": {
        //                 singleton: true,
        //                 requiredVersion: deps["react-dom"],
        //             },
        //         },
        //     ],
        // }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};
