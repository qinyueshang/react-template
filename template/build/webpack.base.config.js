const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const {
    webpackConfig
} = require("../config");
const util = require("./util");

const ROOT_PATH = path.resolve(__dirname, "../");
const APP_PATH = path.resolve(ROOT_PATH, "src");
module.exports = {
    entry: {
        app: ["@babel/polyfill", APP_PATH + "/main.js"]
    },
    output: {
        path: webpackConfig.buildPath,
        filename: util.assetsPath("js/[name].[chunkHash:7].js"),
        chunkFilename: util.assetsPath("js/[id].[chunkHash:7].js"),
        publicPath: webpackConfig.isDev ? webpackConfig.assetsPublicPath : ""
    },
    resolve: {
        alias: {
            reducers: `${APP_PATH}/reducers`,
            router: `${APP_PATH}/router`
        },
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".png", ".json"]
    },
    module: {
        rules: [{
                test: /\.(css|less)?$/,
                // include: [APP_PATH],
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: webpackConfig.isDev
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: webpackConfig.isDev,
                            importLoaders: 1
                            // modules: true,
                            // localIdentName: "[local]-[hash:base64:10]"
                        }
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: webpackConfig.isDev,
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                include: [APP_PATH],
                use: ["babel-loader"]
            },
            // {
            //     test: /\.tsx?$/,
            //     include: [APP_PATH],
            //     use: ["babel-loader", "ts-loader?transpileOnly=true"]
            // },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    `url-loader?limit=3000&minetype=image/svg+xml&name=${util.assetsPath(
                        "svg/[name].[hash:7].[ext]"
                    )}`
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                use: [
                    `url-loader?limit=3000&name=${util.assetsPath(
                        "img/[name].[hash:7].[ext]"
                    )}`
                ],
                include: [APP_PATH],
                exclude: []
            },
            {
                test: /\.json/,
                use: [
                    `json-loader?name=${util.assetsPath(
                        "json/[name].[hash:7].[ext]"
                    )}`
                ],
                type: "javascript/auto",
                include: [APP_PATH]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "demo",
            template: `${APP_PATH}/index.html`,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(webpackConfig.version),
            __DEV__: webpackConfig.isDev,
            // __BASEURL__: JSON.stringify('/'),
        }),
        new MiniCssExtractPlugin({
            filename: util.assetsPath("css/[name].[chunkHash:7].css"),
            chunkFilename: util.assetsPath("css/[id].[chunkHash:7].css")
        })
    ],
    devtool: webpackConfig.devtool,
    stats: {
        colors: true
    },
    performance: {
        hints: false
    },
    cache: webpackConfig.isDev
};