const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const dotenv = require('dotenv')
const { EsbuildPlugin } = require('esbuild-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')

module.exports = (env) => {
    // Get the root path (assuming your webpack config is in the root of your project!)
    const currentPath = path.join(__dirname)
    // Create the fallback path (the production .env)
    const basePath = `${currentPath}/envs/`
    // We're concatenating the environment name to our filename to specify the correct env file!
    const envPath = `${basePath}.env.${env.ENVIRONMENT}`
    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: envPath }).parsed

    const mode = fileEnv.MODE
    // reduce it to a nice object, the same as before (but with the variables from the file)
    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next])
        return prev
    }, {})

    const randomNumber = Date.now();
    let readHtml = `${currentPath}/public/index.html`;
    let writeHtml = `${currentPath}/public/live.html`;

    fs.readFile(readHtml, (err, inputData) => {
        if (err) {
            throw err
        } else {
            if (inputData) {
                let fInput = `${inputData.toString().replace('{RANDOM_NUMBER}', randomNumber)}`
                fs.writeFile(writeHtml, fInput, (err) => {
                    if (err) throw err;
                    else {
                        console.log("The file is updated with the given data")
                    }
                })
            }
        }
    })

    return {
        cache: false,
        entry: {
            munim: ['./src/index.js']
        },
        mode: 'production',
        watchOptions: {
            ignored: '**/node_modules'
        },
        stats: {
            colors: true,
            modules: true,
            reasons: true,
            errorDetails: true
        },
        output: {
            filename: `./static/js/[name].bundle.${randomNumber}.js`,
            path: path.resolve(__dirname, 'build'),
            publicPath: process.env.PUBLIC_URL,
            clean: true,
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        devtool: (mode === 'live') ? false : 'source-map',
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            alias: {
                '@src': path.resolve(__dirname, 'src'),
                '@assets': path.resolve(__dirname, 'src/@core/assets'),
                '@components': path.resolve(__dirname, 'src/@core/components'),
                '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
                '@store': path.resolve(__dirname, 'src/redux'),
                '@styles': path.resolve(__dirname, 'src/@core/scss'),
                '@configs': path.resolve(__dirname, 'src/configs'),
                '@utils': path.resolve(__dirname, 'src/utility/Utils'),
                '@hooks': path.resolve(__dirname, 'src/utility/hooks'),
                process: "process/browser"
            }
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/, // .js and .jsx files
                    exclude: /node_modules/, // excluding the node_modules folder
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            // JavaScript randomNumber to compile to
                            target: 'es2015',
                            loader: 'jsx'
                        }
                    }
                },
                {
                    test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `[name].[hash:8].[ext]`,
                            outputPath: './assets/fonts/' //dont actually use these fonts but still need to process them
                        }
                    }
                },
                {
                    test: /\.(jpg|png|jpeg|gif|PNG|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `[name].[hash:8].[ext]`,
                            outputPath: './assets/images/'
                        }
                    }
                },
                {
                    test: /\.(link|css)$/i,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                injectType: 'linkTag'
                            }
                        },
                        {
                            loader: 'file-loader',
                            options: {
                                name: `[name].[hash:8].[ext]`,
                                outputPath: './static/css/'
                            }
                        },
                        {
                            loader: 'esbuild-loader',
                            options: {
                                minify: true
                            }
                        }
                    ],
                    include: path.resolve(__dirname, "../")
                },
                {
                    test: /\.scss$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" },
                        { loader: "sass-loader" }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                hash: true,
                name: `index.html`,
                inject: false,
                favicon: 'public/favicon.ico',
                template: path.resolve(__dirname, "public/live.html")
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'public/manifest.json'),
                        to: path.resolve(__dirname, 'build')
                    },
                    {
                        from: path.resolve(__dirname, 'public/192.png'),
                        to: path.resolve(__dirname, 'build')
                    },
                    {
                        from: path.resolve(__dirname, 'public/512.png'),
                        to: path.resolve(__dirname, 'build')
                    }
                ]
            })
        ]
    }
}