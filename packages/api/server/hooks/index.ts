export * from './post'

export const pipeHooks = (...fns: any[]) =>
  (...args: any[]) => fns.reduce((v, f) => f(...v), args)

