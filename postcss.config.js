
// https://github.com/michael-ciniawsky/postcss-load-config
const browserslist = [
  'iOS >= 8',
  'Android > 4.0',
];
module.exports = () => {
  const plugins = {
    // 'postcss-url': {url: 'inline'},
    'cssnano': {
      preset: ['default', {
        zindex: false,
        mergeIdents: false,
        discardUnused: false,
        autoprefixer: false,
        reduceIdents: false,
      }]
    },
    'autoprefixer': { browsers: browserslist },
    'postcss-pxtorem': { rootValue: 100, minPixelValue: 2, propWhiteList: [] }
  }

  // if (process.env.NODE_ENV !== 'production' || process.env.BUILD_TYPE === 'example') {
  //   plugins['postcss-pxtorem'] = { rootValue: 100, minPixelValue: 2, propWhiteList: [] }
  // }

  return {
    plugins
  }
}
