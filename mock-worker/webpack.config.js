const { EnvironmentPlugin } = require('webpack')

module.exports = env => {
  console.log('webpack env', env.NODE_ENV)
  return {
    target: 'webworker',
    devtool: 'cheap-module-source-map',
    entry: './index.js',
    mode: 'development',
    plugins: [
      new EnvironmentPlugin({
        SOMETHING_ELSE: 'kjhasdkjha',
      }),
    ],
  }
}
