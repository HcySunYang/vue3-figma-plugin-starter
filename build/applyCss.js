const defaultOpts = {
  extract: false,
  cssModules: false,
  sourceMap: false,
  cssLoaderOptions: {},
  postcssLoaderOptions: null,
  lessLoaderOptions: null,
  scssLoaderOptions: null,
  sassLoaderOptions: null,
  stylusLoaderOptions: null
}

module.exports = function applyCss(config, options) {
  const opts = { ...defaultOpts, ...options }

  function createRule(lang, test, loader, lodaerOptions) {
    const forceCssModule = opts.cssModules !== false
    const vueModuleRule = config.module
      .rule(lang)
      .test(test)
      .oneOf('vue-module')
      .resourceQuery(/module/)
    applyLoaders(vueModuleRule, true)

    const vueNormalRule = config.module
      .rule(lang)
      .test(test)
      .oneOf('vue-normal')
      .resourceQuery(/vue/)
    applyLoaders(vueNormalRule, false)

    const moduleRule = config.module
      .rule(lang)
      .test(test)
      .oneOf('module')
      .test(/\.module\.\w+$/)
    applyLoaders(moduleRule, true)

    const normalRule = config.module.rule(lang).test(test).oneOf('normal')
    applyLoaders(normalRule, false)

    function applyLoaders(rule, isCSSModule) {
      rule
        .use('css')
        .loader('css-loader')
        .options({
          modules: forceCssModule || isCSSModule,
          sourceMap: opts.sourceMap,
          ...opts.cssLoaderOptions
        })

      // postcss
      if (opts.postcssLoaderOptions) {
        rule
          .use('postcss')
          .loader('postcss-loader')
          .options({
            sourceMap: opts.sourceMap,
            ...opts.postcssLoaderOptions
          })
      }

      // less/scss/sass/stylus
      if (loader) {
        rule
          .use(lang)
          .loader(loader)
          .options({ sourceMap: opts.sourceMap, ...lodaerOptions })
      }
    }
  }

  createRule('css', /\.css$/)
  if (opts.lessLoaderOptions) {
    createRule('less', /\.less$/, 'less-loader', opts.lessLoaderOptions)
  }
  if (opts.scssLoaderOptions) {
    createRule('scss', /\.scss$/, 'sass-loader', {
      implementation: require('sass'),
      ...opts.scssLoaderOptions
    })
  }
  if (opts.sassLoaderOptions) {
    createRule('sass', /\.sass$/, 'sass-loader', {
      implementation: require('sass'),
      ...opts.sassLoaderOptions,
      sassOptions: {
        ...(opts.sassLoaderOptions && opts.sassLoaderOptions.sassOptions),
        indentedSyntax: true
      }
    })
  }

  if (opts.stylusLoaderOptions) {
    createRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
      preferPathResolver: 'webpack',
      ...opts.stylusLoaderOptions
    })
  }
}
