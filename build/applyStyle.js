const defaultOpts = {
  vue: false,
  loaderOptions: {}
}

module.exports = function applyStyle(config, options = {}) {
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
          .use('style')
          .loader(opts.vue ? 'vue-style-loader' : 'style-loader')
          .options(opts.loaderOptions)
          .before('css')
      })
    })
}
