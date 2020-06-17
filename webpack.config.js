const path = require('path'); //Node module
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'], //Assign file as entry file/ Babel-polyfill doesn't conver ES6 to ES5
    output: { //Save bundle file
        path: path.resolve(__dirname, 'dist'), //It's mehod which available to join current absolute path
        filename: 'js/bundle.js',
    },
    devServer: { //Object which should serve our files
        contentBase: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html' //Starting html file
        }),
    ],
    module: { //Babel
        rules: [{
            test: /\.js$/,  //test file with .js
            exclude: /node_modules/, //Exclude node_modules folder
            use: {
                loader: 'babel-loader'
            }
        }]
    }
};