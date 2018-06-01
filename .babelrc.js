const { isProd } = require('./config')
const BABEL_ENV = process.env.BABEL_ENV || 'modern'

const presets = [
  [
    '@babel/preset-react',
    {
      pragma: 'h',
      pragmaFrag: '"span"', // see: https://github.com/developit/preact/issues/946
      development: !isProd,
      useBuiltIns: true
    }
  ]
]

const plugins = [
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: true
    }
  ]
]

const modernConfig = {
  presets,
  plugins: [
    [
      '@babel/plugin-transform-modules-commonjs'
    ],
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true
      }
    ]
  ].concat(plugins)
}

const legacyConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        loose: true
      }
    ]
  ].concat(presets),
  plugins
}

module.exports = BABEL_ENV === 'modern'
  ? modernConfig
  : legacyConfig
