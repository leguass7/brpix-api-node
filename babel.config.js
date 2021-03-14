module.exports = function (api) {
  api.cache(true)
  console.log('BABEl CONFIG')
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
      '@babel/preset-flow'
    ]
  }
}
