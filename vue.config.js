module.exports = {
  chainWebpack: config => {
    config.module
      .rule('moc')
      .test(/\.moc$/)
      .use('arraybuffer-loader')
      .loader('arraybuffer-loader')
      .end()
    config.module
      .rule('file')
      .test(/\.(zip|gltf)$/)
      .use('file-loader')
      .loader('file-loader')
      .end()
    config.module
      .rule('raw')
      .test(/\.(vs|fs|glsl)(\?.*)?$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
