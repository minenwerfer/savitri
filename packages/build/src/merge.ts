import type { Configuration } from 'webpack'
import { merge as originalMerge } from 'webpack-merge'

export default (from: Configuration, to: Configuration) =>
  originalMerge(from as object, to as object)
