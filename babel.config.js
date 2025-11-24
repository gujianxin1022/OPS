module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: '3'
      }
    ],
    [
      '@vue/babel-preset-jsx',
      {
        compositionAPI: true
      }
    ]
  ]
}
