module.exports = {
  chainWebpack: config => {
    config.module
      .rule('moc')
      .test(/\.moc$/)
      .use('arraybuffer-loader')
      .loader('arraybuffer-loader')
      .end()
    config.module
      .rule('raw')
      .test(/\.(vs|fs|glsl)(\?.*)?$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
      .use('glslify-loader')
      .loader('glslify-loader')
      .end()
  }
}
