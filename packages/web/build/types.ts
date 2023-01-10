import type { Configuration } from 'webpack'

export type BuildConfig = Configuration & {
  tsTranspileOnly?: boolean
}

export type InstanceConfig = {
  themes?: Array<string>
}

export type BuildParams = {
  appDir: string
  buildConfig: BuildConfig
  instanceConfig: InstanceConfig
}
