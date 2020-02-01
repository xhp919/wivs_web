
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    port: 9456
  },
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('@src', resolve('src'))
      .set('@components', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
      .set('@views', resolve('src/views'))
      .set('@router', resolve('src/router'))
      .set('@tools', resolve('src/tools'))
  }
}