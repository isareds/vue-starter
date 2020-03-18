module.exports = {
  lintOnSave: false,
  devServer: {
		proxy: "http://lunch-problem.local",
    watchOptions: {
      poll: true
    },
    disableHostCheck: true
  }
};
