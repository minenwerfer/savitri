/**
 * @exports @const
 * Caches dynamic queries (__query) for further usage.
 */
export const queryCache = (store: any) => {
  store.subscribe((mutation: { type: string, payload: any }) => {
    const { type, payload } = mutation

    if( /DESCRIPTION_SET$/.test(type) ) {
      console.log({ mutation })
    }
  })
}
