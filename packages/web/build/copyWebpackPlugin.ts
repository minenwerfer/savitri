import CopyWebpackPlugin from 'copy-webpack-plugin'

export default (appDir: string) => {
  return new CopyWebpackPlugin({
    patterns: [
      {
        from: `${appDir}/static`,
        to: 'static',
        noErrorOnMissing: true
      }
    ]
  })
}
