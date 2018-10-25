module.exports = {
  chainWebpack: config => {
    config.module
      .rule('moc')
      .test(/\.moc$/)
      .use('arraybuffer-loader')
      .loader('arraybuffer-loader')
      .end()
  }
}
