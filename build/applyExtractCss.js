const { getFileNames } = require('./utils')

const defaultOpts = {
  extract: {},
  minimize: false,
  sourceMap: false
}

module.exports = function applyExtractCss(config, options = {}) {
  const opts = { ...defaultOpts, ...options }
  const rules = config.module.rules

  const isApplyCss = rules.has('css')
  if (!isApplyCss) {
    throw Error('You need to call `applyCss` first.')
  }

  const cssRule = config.module.rule('css')
  const lessRule = rules.has('less') ? config.module.rule('less') : null
  const scssRule = rules.has('scss') ? config.module.rule('scss') : null
  const sassRule = rules.has('sass') ? config.module.rule('sass') : null
  const stylusRule = rules.has('stylus') ? config.module.rule('stylus') : null

  ;[cssRule, lessRule, scssRule, sassRule, stylusRule]
    .filter((_) => _)
    .forEach((rule) => {
      rule.oneOfs.values().forEach((rule) => {
        rule
          .use('extract')
          .loader(require('mini-css-extract-plugin').loader)
          .before('css')
      })
    })

  const fileNames = getFileNames(true)
  config.plugin('extract-css').use(require('mini-css-extract-plugin'), [
    {
      filename: fileNames.css,
      chunkFilename: fileNames.css.replace(/\.css$/, '.chunk.css')
    }
  ])

  if (opts.minimize) {
    const cssnanoOptions = {
      safe: true,
      autoprefixer: { disable: true },
      mergeLonghand: false
    }
    if (opts.sourceMap) {
      cssnanoOptions.map = { inline: false }
    }
    const OptimizeCSSPlugin = require('@intervolga/optimize-cssnano-plugin')
    config.plugin('optimize-css').use(OptimizeCSSPlugin, [
      {
        sourceMap: opts.sourceMap,
        cssnanoOptions
      }
    ])
  }
}
