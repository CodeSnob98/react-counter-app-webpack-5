
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin")


module.exports = ({ mode } = { mode: "production" }) => {
    console.log(`mode is: ${mode}`);
    console.log("######################", process.env)
    return {
            mode : "production",
            entry: "./src/index.js",
            output: {
                publicPath: "/",
                path: path.resolve(__dirname, "build"),
                filename: "bundle.js"
            },
            // performance: {
            //   hints: false
            // },            
            devServer: {
                open: true,
                hot: true
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: [
                          MiniCssExtractPlugin.loader,
                          "css-loader",
                          {
                            loader: "postcss-loader",
                            options: {
                              postcssOptions: {
                                plugins: [["postcss-preset-env", {}]],
                              },
                            },
                          },
                        ],
                      },
                      {
                        test: /\.s[ac]ss$/,
                        use: [
                          MiniCssExtractPlugin.loader,
                          "css-loader",
                          {
                            loader: "postcss-loader",
                            options: {
                              postcssOptions: {
                                plugins: [["postcss-preset-env", {}]],
                              },
                            },
                          },
                          "sass-loader",
                        ],
                      },
                    {
                        test:/.(png|svg|jpeg|gif)$/, //for loading images 
                        type:"asset/resource"
                    },
                 {
                    test: /\.jpe?g|png$/,
                    exclude: /node_modules/,
                    use: ["url-loader", "file-loader"]
                },
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        loader: "babel-loader"
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: "./public/index.html"
                }),
                new CopyPlugin({ //to follow the same folder structure in dist folder
                  patterns:[ {
                   from:path.resolve(__dirname,"public/assets"),
                   to: path.resolve(__dirname,"build/assets"),
                   context : "build"
               }]}),
                new MiniCssExtractPlugin()
            ],
            optimization: {
                minimize: true,
                minimizer: [
                  // This is only used in production mode
                  new TerserPlugin({
                    terserOptions: {
                      parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                      },
                      compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                      },
                      mangle: {
                        safari10: true,
                      },
                      output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                      },
                    },
                  }),
                  // This is only used in production mode
                  new CssMinimizerPlugin(),
                ],
              }        
        }
};