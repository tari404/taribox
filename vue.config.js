module.exports = {
  chainWebpack: config => {
    config.module
      .rule('moc')
      .test(/\.moc$/)
      .use('arraybuffer-loader')
      .loader('arraybuffer-loader')
      .end()
    config.module
      .rule('zip')
      .test(/\.zip$/)
      .use('url-loader')
      .loader('url-loader')
      .end()
  }
}
