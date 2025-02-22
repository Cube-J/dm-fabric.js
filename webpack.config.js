const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/index.js',
  experiments: {
    outputModule: true
  },
  output: {
    filename: 'fabric.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      // name: 'fabric',
      type: 'module',
    },
  },
  // devtool: 'source-map'
  // externals: {
  //   'canvas': 'undefined',
  //   'jsdom/lib/jsdom/utils': JSON.stringify({ Canvas: null }),
  //   'jsdom/lib/jsdom/living/generated/utils': JSON.stringify({ implForWrapper: null }),
  //   'jsdom': JSON.stringify({ JSDOM: null })
  // },
};