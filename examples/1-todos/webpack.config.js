var pageSrcPath = __dirname + '/src/pages/';

module.exports = {
    entry: {
        todos: pageSrcPath + 'todos.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/statics/bundle'
    },
    module: {
        rules: [
            {
                test: /\.png$/,
                loader: "url-loader?prefix=img/&limit=8192"
            }, {
                test: /\.html$/,
                loader: "html-loader"
            }, {
                test: /\.svg$/,
                loader: "url-loader?mimetype=image/svg+xml"
            }, {
                test: /\.jpg$/,
                loader: "url-loader?prefix=img/&limit=8192"
            }, {
                test: /\.gif$/,
                loader: "url-loader?prefix=img/&limit=8192"
            }, {
                test: /\.woff$/,
                loader: "url-loader?prefix=font/&limit=8192"
            }, {
                test: /\.eot$/,
                loader: "file-loader?prefix=font/"
            }, {
                test: /\.ttf$/,
                loader: "file-loader?prefix=font/"
            }, {
                test: /\.md$/,
                loader: "html!remarkable"
            }, {
                test: /\.json$/,
                loader: "json-loader"
            }, {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015', 'stage-3']
                    }
                }
            }
        ]
    },
    node: {
        console: true,
        fs: "empty",
        net: "mock",
        tls: "mock"
    }
};
