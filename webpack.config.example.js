module.exports = {
  entry: "./example/index.ts",
  output: {
    filename: "index.js",
    path: __dirname + "/dist"
  },

  resolve: {
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: "awesome-typescript-loader" }
    ]
  }
};