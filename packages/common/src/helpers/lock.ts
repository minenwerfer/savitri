export const __locks: { [key: string]: boolean } = {}

export const withIsomorphicLock =
async (lockName: string, cb: () => void, throwOnLocked: boolean = false) => {
  if( __locks[lockName] ) {
    if( throwOnLocked ) {
      throw new Error(`lock ${lockName} in use`)
    }

    await new Promise<void>((resolve) => {
      setInterval(() => {
        if( !__locks[lockName] ) {
          resolve()
        }
      }, 100)
    })
  }

  __locks[lockName] = true

  const result = await cb()
  __locks[lockName] = false

  return result
}
