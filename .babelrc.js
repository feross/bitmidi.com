const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'development'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        loose: true
      }
    ],
    [
      '@babel/preset-react',
      {
        pragma: 'h',
        pragmaFrag: '"span"', // see: https://github.com/developit/preact/issues/946
        development: env === 'development',
        useBuiltIns: true
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true
      }
    ]
  ]
}
