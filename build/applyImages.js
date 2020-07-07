const { getFileNames } = require('./utils')

const defaultOpts = {
  isProd: true
}

module.exports = function applyImages(config, options = {}) {
  const opts = { ...defaultOpts, ...options }
  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp)$/)
    .use('url')
    .loader('url-loader')
    .options({
      limit: 4096,
      // use explicit fallback to avoid regression in url-loader>=1.1.0
      fallback: {
        loader: require.resolve('file-loader'),
        options: {
          name: getFileNames(opts.isProd).image
        }
      },
      ...options
    })

  // do not base64-inline SVGs.
  // https://github.com/facebookincubator/create-react-app/pull/1180
  config.module
    .rule('svg')
    .test(/\.(svg)$/)
    .use('file')
    .loader(require.resolve('file-loader'))
    .options({
      name: getFileNames(opts.isProd).image
    })
}
