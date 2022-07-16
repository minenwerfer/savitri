export const pipeHooks = (...fns: any[]) =>
  (...args: any[]) => fns.reduce((v, f) => f(...v), args)

export * from './post'
