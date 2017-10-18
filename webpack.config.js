const webpack = require("webpack");
const path = require("path");

var config = {
	devtool: "source-map",
	context: path.resolve("./src"),
	entry: {
		app: "./index.ts"
	},
	watch: true,
	output: {
		path: path.resolve("./example"),
		filename: "[name].bundle.js",
		sourceMapFilename: "[name].bundle.map",
		devtoolModuleFilenameTemplate: function (info) {
			return "file:///" + info.absoluteResourcePath;
		}
	},
	module: {
		rules: [
		{
			enforce: "pre",
			test: /\.ts?$/,
			exclude: ["node_modules"],
			use: ["awesome-typescript-loader", "source-map-loader"]
		}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	}
};

module.exports = config;