exports.getFileNames = (useHash = true, hashLen = 8) => {
  return {
    js: useHash ? `js/[name].[chunkhash:${hashLen}].js` : 'js/[name].js',
    css: useHash ? `css/[name].[chunkhash:${hashLen}].css` : 'css/[name].css',
    font: useHash
      ? `fonts/[name].[hash:${hashLen}].[ext]`
      : 'fonts/[path][name].[ext]',
    image: useHash
      ? `images/[name].[hash:${hashLen}].[ext]`
      : 'images/[path][name].[ext]',
    media: useHash
      ? `medias/[name].[hash:${hashLen}].[ext]`
      : 'medias/[path][name].[ext]'
  }
}
