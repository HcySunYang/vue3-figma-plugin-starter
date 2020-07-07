const { resolve } = require('path')
const WebpackChain = require('webpack-chain')
const { getFileNames } = require('./utils')
const applyCss = require('./applyCss')
const applyExtractCss = require('./applyExtractCss')
const applyImages = require('./applyImages')
const applyStyle = require('./applyStyle')

const config = new WebpackChain()
const isDEV = process.env.NODE_ENV === 'development'

config.mode(isDEV ? 'development' : 'production')

// This is necessary because Figma's 'eval' works differently than normal eval
config.devtool(isDEV ? 'inline-source-map' : false)

// entry
config
  .entry('ui')
  .add(resolve(__dirname, '../src/ui/index.tsx'))
  .end()
  .entry('figma')
  .add(resolve(__dirname, '../src/figma/index.ts'))

// output
const nameMap = getFileNames(false)
config.output
  .path(resolve(__dirname, '../dist'))
  .filename(nameMap.js)
  .chunkFilename(nameMap.js)

config.resolve.extensions.add('.tsx').add('.ts').add('.json').add('.js')

// ts
const tsRule = config.module.rule('ts').test(/\.tsx?$/)
tsRule.include
  .add((filepath) => {
    return !/node_modules/.test(filepath)
  })
  .end()
  .use('babel')
  .loader('babel-loader')
  .end()
  .use('ts')
  .loader('ts-loader')

// CSS
applyCss(config)
applyExtractCss(config)
applyStyle(config)

// Image
applyImages(config)

// Generate HTML file
const HtmlWebpackPlugin = require('html-webpack-plugin')
config.plugin('html-generate').use(HtmlWebpackPlugin, [
  {
    template: resolve(__dirname, '../src/ui/ui.html'),
    filename: 'ui.html',
    chunks: ['ui']
  }
])
config
  .plugin('html-inline-source')
  .use(require('./InlineChunkHtmlPlugin'), [HtmlWebpackPlugin, ['.(js)$']])

config.plugin('clean').use(require('clean-webpack-plugin').CleanWebpackPlugin, [
  {
    cleanStaleWebpackAssets: false
  }
])

config.externals({
  vue: 'Vue'
})

config.plugin('define').use(require('webpack').DefinePlugin, [
  {
    global: {} // Fix missing symbol error when running in developer VM
  }
])

module.exports = config.toConfig()
